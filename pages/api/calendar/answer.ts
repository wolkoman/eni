import {NextApiRequest, NextApiResponse} from 'next';
import {google} from "googleapis";
import {Cockpit} from "@/util/cockpit";
import {getGoogleAuthClient} from "@/app/(shared)/GoogleAuthClient";
import {mapEvent} from "@/domain/events/EventMapper";
import {getCalendarInfo} from "@/domain/events/CalendarInfo";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {applySuggestionToPatch, getSuggestionFromDiff} from "@/domain/suggestions/SuggestionsMapper";
import {Permission} from "@/domain/users/Permission";
import {resolveUserFromRequest} from "@/domain/users/UserResolver";
import {sendMail} from "@/app/(shared)/Mailjet";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req)!;
    const access = user.permissions[Permission.CalendarAdministration];
    if (!access) {
        res.status(401).json({error: "No access right"});
        return;
    }

    const eventSuggestions = await Cockpit.collectionGet("eventSuggestion", {
        filter: {
            open: true,
            _id: req.body.suggestionId
        }
    }).then(({entries}) => entries);

    if (eventSuggestions.length !== 1) {
        res.status(404).json({error: "No suggestion found"});
        return;
    }
    const suggestion = eventSuggestions[0];
    const suggestionParish = getCalendarInfo(suggestion.parish);
    const suggestionValues = getSuggestionFromDiff(suggestion);

    if (!req.body.accepted) {
        await Cockpit.collectionSave("eventSuggestion", {
            _id: eventSuggestions[0]._id,
            accepted: false,
            open: false,
            closedBy: user._id,
            closedByName: user.name
        });
        if(user.email){
            await sendMail(4570749, user.name, user.email, "Abgelehnter Termin: " + suggestionValues.summary, {
                summary: suggestionValues.summary,
                dateandtime: new Date(suggestionValues.date+"T"+suggestionValues.time).toLocaleString("de-AT", {timeZone: "Europe/Vienna"}),
                description: suggestionValues.description,
                name: user.name,
                reason: req.body.reason
            })
        }
        res.json({accepted: false});
        return;
    }


    const eventData = {
        auth: await getGoogleAuthClient(),
        calendarId: suggestionParish.calendarId,
        eventId: suggestion.eventId
    };
    const existingGoogleEvent = await (suggestion.eventId
      ? google.calendar('v3').events.get(eventData).then(event => event.data)
      : Promise.resolve(undefined)
    );
    const existingEvent = mapEvent(suggestionParish.id, {access: EventLoadAccess.PRIVATE_ACCESS})(existingGoogleEvent);
    const patchedSuggestion = getSuggestionFromDiff(applySuggestionToPatch(suggestion, existingEvent ?? undefined).suggestion);

    const patchedEvent = {
        description: patchedSuggestion.description,
        summary: patchedSuggestion.summary,
        start: {
            dateTime: `${patchedSuggestion.date}T${patchedSuggestion.time}:00`,
            timeZone: 'Europe/Vienna'
        },
        end: {
            dateTime: `${patchedSuggestion.date}T${patchedSuggestion.time.split(":").map((a, b) => +a + (1 - b)).join(":")}:00`,
            timeZone: 'Europe/Vienna'
        }
    }

    if (suggestion.type === "add") {
        google.calendar('v3').events.insert({
            auth: await getGoogleAuthClient(),
            calendarId: suggestionParish.calendarId,
            requestBody: patchedEvent
        }).then((event) => {
            res.status(200).json({ok: true, link: event.data.htmlLink});
        }).catch((err) => {
            console.log(err);
            res.status(500).json({err});
        });
        await Cockpit.collectionSave("eventSuggestion", {
            _id: eventSuggestions[0]._id,
            accepted: true,
            open: false,
            closedBy: user._id,
            closedByName: user.name
        });
    } else if (suggestion.type === "edit" && existingGoogleEvent) {
        google.calendar('v3').events.patch({
            ...eventData,
            requestBody: {...patchedEvent, summary: patchedEvent.summary + (existingEvent?.mainPerson ? `/${existingEvent?.mainPerson}` : "")}
        })
            .then((event) => {
                res.status(200).json({ok: true, link: event.data.htmlLink});
            }).catch((err) => {
            console.log(err);
            res.status(500).json({err});
        });

        await Cockpit.collectionSave("eventSuggestion", {
            _id: eventSuggestions[0]._id,
            accepted: true,
            open: false,
            closedBy: user._id,
            closedByName: user.name
        });
    }


}

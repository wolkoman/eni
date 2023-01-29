import {NextApiRequest, NextApiResponse} from 'next';
import {getCachedGoogleAuthClient, GetEventPermission, mapGoogleEventToEniEvent} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {google} from "googleapis";
import {CalendarName, getCalendarInfo} from "../../../util/calendar-info";
import {cockpit} from "../../../util/cockpit-sdk";
import {getSuggestion} from "../../../util/suggestion-utils";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req)!;
    const access = user.permissions[Permission.CalendarAdministration];
    if (!access) {
        res.status(401).json({error: "No access right"});
        return;
    }

    const eventSuggestions = await cockpit.collectionGet("eventSuggestion", {
        filter: {
            open: true,
            _id: req.body.suggestionId
        }
    }).then(({entries}) => entries);

    if (eventSuggestions.length !== 1) {
        res.status(404).json({error: "No suggestion found"});
        return;
    }

    if (!req.body.accepted) {
        await cockpit.collectionSave("eventSuggestion", {
            _id: eventSuggestions[0]._id,
            accepted: false,
            open: false,
            closedBy: user._id,
            closedByName: user.name
        });
        res.json({accepted: false});
        return;
    }

    const suggestion = eventSuggestions[0];
    const suggestionParish = getCalendarInfo(suggestion.data.parish as CalendarName);
    const googleEvent = {
        description: suggestion.data.description,
        summary: suggestion.data.summary,
        start: {
            dateTime: `${suggestion.data.date}T${suggestion.data.time}:00`,
            timeZone: 'Europe/Vienna'
        },
        end: {
            dateTime: `${suggestion.data.date}T${suggestion.data.time.split(":").map((a, b) => +a + (1 - b)).join(":")}:00`,
            timeZone: 'Europe/Vienna'
        }
    }

    if (suggestion.type === "add") {
        google.calendar('v3').events.insert({
            auth: await getCachedGoogleAuthClient(),
            calendarId: suggestionParish.calendarId,
            requestBody: googleEvent
        }).then((event) => {
            res.status(200).json({ok: true, link: event.data.htmlLink});
        }).catch((err) => {
            console.log(err);
            res.status(500).json({err});
        });
        await cockpit.collectionSave("eventSuggestion", {
            _id: eventSuggestions[0]._id,
            accepted: true,
            open: false,
            closedBy: user._id,
            closedByName: user.name
        });
    } else if (suggestion.type === "edit") {
        const eventData = {
            auth: await getCachedGoogleAuthClient(),
            calendarId: suggestionParish.calendarId,
            eventId: suggestion.eventId
        };
        const event = await google.calendar('v3').events.get(eventData).then(event => event.data);
        const [summary, mainPerson] = [...event.summary?.split("/", 2) ?? [null], null];
        google.calendar('v3').events.patch({
            ...eventData,
            requestBody: {...googleEvent, summary: googleEvent.summary + (mainPerson ? `/${mainPerson}` : "")}
        })
            .then((event) => {
                res.status(200).json({ok: true, link: event.data.htmlLink});
            }).catch((err) => {
            console.log(err);
            res.status(500).json({err});
        });

        await cockpit.collectionSave("eventSuggestion", {
            _id: eventSuggestions[0]._id,
            previousData: getSuggestion(mapGoogleEventToEniEvent(suggestionParish.id, {permission: GetEventPermission.PRIVATE_ACCESS})(event) ?? undefined),
            accepted: true,
            open: false,
            closedBy: user._id,
            closedByName: user.name
        });
    }


}

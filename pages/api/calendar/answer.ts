import {NextApiRequest, NextApiResponse} from 'next';
import {getCachedGoogleAuthClient} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {google} from "googleapis";
import {getCalendarInfo} from "../../../util/calendar-info";
import {cockpit} from "../../../util/cockpit-sdk";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req)!;
    const access = user.permissions[Permission.CalendarAdministration];
    if (!access) {
        res.status(401).json({error: "No access right"});
        return;
    }

    const eventSuggestions = await cockpit.collectionGet("eventSuggestion", {filter: {open: true, _id: req.body.suggestionId}}).then(({entries}) => entries);

    if(eventSuggestions.length !== 1){
        res.status(404).json({error: "No suggestion found"});
        return;
    }

    await cockpit.collectionSave("eventSuggestion", {
        _id: eventSuggestions[0]._id,
        accepted: req.body.accepted,
        open: false,
        closedBy: user._id,
        closedByName: user.name
    });
    const suggestion = eventSuggestions[0];

    console.log(suggestion);
    const eventRequestData = {
        auth: await getCachedGoogleAuthClient(),
        calendarId: getCalendarInfo(req.body.parish).calendarId,
        eventId: suggestion.eventId,
    }

    google.calendar('v3').events.patch({
        ...eventRequestData,
        requestBody: {
            description: suggestion.data.description,
            summary: suggestion.data.summary,
            start: {
                dateTime: `${suggestion.data.date}T${suggestion.data.time}:00`,
                timeZone: 'Europe/Vienna'
            },
            end: {
                dateTime: `${suggestion.data.date}T${suggestion.data.time.split(":").map((a,b) => +a+(1-b)).join(":")}:00`,
                timeZone: 'Europe/Vienna'
            }
        }
    }).then((event) => {
        res.status(200).json({ok: true});
    }).catch((err) => {
        console.log(err);
        res.status(500).json({err});
    });

}

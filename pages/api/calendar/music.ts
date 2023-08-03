import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {google} from "googleapis";
import {musicDescriptionMatch} from "../../intern/limited-event-editing";
import {loadReaderData} from "../reader";
import {getGoogleAuthClient} from "../../../app/(shared)/GoogleAuthClient";
import {GetEventPermission, mapEvent} from "../../../app/termine/EventMapper";
import {CalendarName, getCalendarInfo} from "../../../app/termine/CalendarInfo";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        res.status(402).json({error: "POST is needed"});
        return;
    }

    const user = resolveUserFromRequest(req)!;
    const access = user.permissions[Permission.LimitedEventEditing];
    if (!access) {
        res.status(401).json({error: "No access right"});
        return;
    }

    const oauth2Client = await getGoogleAuthClient();
    const calendar = google.calendar('v3');

    const event = await calendar.events.get({
        eventId: req.body.eventId,
        calendarId: getCalendarInfo(CalendarName.INZERSDORF).calendarId,
        auth: oauth2Client
    });
    const description = event.data.description ?? "";

    const newDescription = req.body.music === ""
        ? description.replace(musicDescriptionMatch, "")
        : (description.match(musicDescriptionMatch)
            ? description.replace(musicDescriptionMatch, "Musikal. Gestaltung: "+req.body.music)
            : `${description}${description ? "\n" : ""}Musikal. Gestaltung: ${req.body.music}`)

    calendar.events.patch({
        auth: oauth2Client,
        calendarId: getCalendarInfo(CalendarName.INZERSDORF).calendarId,
        eventId: req.body.eventId,
        requestBody: {description: newDescription.trim()}
    }).then((event) => {
        const eniEvent = mapEvent(CalendarName.INZERSDORF, {
            permission: GetEventPermission.PRIVATE_ACCESS
        })(event.data);
        res.status(200).json(eniEvent);
    }).catch((err) => {
        res.status(500).json({err});
    });


}

import {NextApiRequest, NextApiResponse} from 'next';
import {calendarIds, getCachedGoogleAuthClient, getCachedEvents} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {google} from "googleapis";
import {musicDescriptionMatch} from "../../intern/limited-event-editing";

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

    const oauth2Client = await getCachedGoogleAuthClient();
    const calendar = google.calendar('v3');

    const event = await calendar.events.get({
        eventId: req.body.eventId,
        calendarId: calendarIds.inzersdorf,
        auth: oauth2Client
    });
    const description = event.data.description ?? "";
    const newDescription = req.body.music === ""
        ? description.replace(/^Musikal\. Gestaltung:.*$/gm, "")
        : (description.match(musicDescriptionMatch)
            ? description.replace(musicDescriptionMatch, req.body.music)
            : `${description}${description ? "\n" : ""}Musikal. Gestaltung: ${req.body.music}`)

    calendar.events.patch({
        auth: oauth2Client,
        calendarId: calendarIds['inzersdorf'],
        eventId: req.body.eventId,
        requestBody: {description: newDescription.trim()}
    }).then((event) => {
        res.status(200).json(event.data);
    }).catch((err) => {
        res.status(500).json({err});
    });


}

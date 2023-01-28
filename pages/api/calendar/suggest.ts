import {NextApiRequest, NextApiResponse} from 'next';
import {getCachedGoogleAuthClient, GetEventPermission, mapGoogleEventToEniEvent} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {google} from "googleapis";
import {musicDescriptionMatch} from "../../intern/limited-event-editing";
import {CalendarName, getCalendarInfo} from "../../../util/calendar-info";
import {getCachedReaderData, invalidateCachedReaderData} from "../reader";
import {cockpit} from "../../../util/cockpit-sdk";
import {notifyAdmin} from "../../../util/telegram";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req)!;
    const access = user.permissions[Permission.PrivateCalendarAccess];
    if (!access) {
        res.status(401).json({error: "No access right"});
        return;
    }

    const eventSuggestions = await cockpit.collectionGet("eventSuggestion", {filter: {open: true, eventId: req.body.eventId}}).then(({entries}) => entries);

    if(eventSuggestions.some(suggestion => suggestion.by !== user._id)){
        res.status(401).json({error: "Pending suggestion from other person"});
        return;
    }

    const eventSuggestion = await cockpit.collectionSave("eventSuggestion", {
        _id: eventSuggestions?.[0]?._id,
        eventId: req.body.eventId,
        data: req.body.data,
        by: user._id,
        byName: user.name,
        open: true
    });

    await notifyAdmin("new eventSuggestion by " + user.name + ": " + JSON.stringify(req.body.data));

    res.json(eventSuggestion);

}

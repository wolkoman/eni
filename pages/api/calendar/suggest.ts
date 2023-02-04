import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {cockpit} from "../../../util/cockpit-sdk";
import {notifyAdmin} from "../../../util/telegram";
import {slack} from "../../../util/slack";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req)!;
    const access = user.permissions[Permission.PrivateCalendarAccess];
    if (!access) {
        res.status(401).json({error: "No access right"});
        return;
    }

    //prevent colliding suggestions
    const collidingSuggestions = await cockpit.collectionGet("eventSuggestion", {
        filter: {
            open: true,
            eventId: req.body.eventId
        }
    }).then(({entries}) => entries.filter(suggestion => suggestion.eventId !== null));
    if (collidingSuggestions.some(suggestion => suggestion.by !== user._id)) {
        res.status(401).json({error: "Pending suggestion from other person"});
        return;
    }

    //edit new suggestion
    const [_,suggestionId] = [...req.body.eventId?.split("suggestion_") ?? [null],null]

    const eventSuggestion = await cockpit.collectionSave("eventSuggestion", {
        _id: suggestionId ?? collidingSuggestions?.[0]?._id,
        eventId: suggestionId ? null : req.body.eventId,
        data: req.body.data,
        parish: req.body.parish,
        type: suggestionId ? "add" : req.body.type,
        by: user._id,
        byName: user.name,
        open: true
    });

    await notifyAdmin("new eventSuggestion by " + user.name + ": " + JSON.stringify(req.body.data));

    const channel = process.env.STAGE === "prod" ? 'C047C4D4R7B' : 'U0HJVFER4';
    await slack("chat.postMessage", {channel, text: `_${user.name}_ hat einen Terminvorschlag eingereicht:\n*${req.body.data.date} ${req.body.data.time} ${req.body.data.summary}*`})

    res.json(eventSuggestion);

}

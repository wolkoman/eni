import {NextApiRequest, NextApiResponse} from 'next';
import {Cockpit} from "@/util/cockpit";
import {getSuggestionFromDiff} from "@/domain/suggestions/SuggestionsMapper";
import {Permission} from "@/domain/users/Permission";
import {resolveUserFromRequest} from "@/domain/users/UserResolver";
import {slack} from "@/app/(shared)/Slack";
import {notifyAdmin} from "@/app/(shared)/Telegram";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req)!;
    const access = user.permissions[Permission.PrivateCalendarAccess];
    if (!access) {
        res.status(401).json({error: "No access right"});
        return;
    }

    //prevent colliding suggestions
    const collidingSuggestions = await Cockpit.collectionGet("eventSuggestion", {
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
    const type = suggestionId ? "add" : req.body.eventId ? "edit" : "add"

    const eventSuggestion = await Cockpit.collectionSave("eventSuggestion", {
        _id: suggestionId ?? collidingSuggestions?.[0]?._id,
        eventId: suggestionId ? null : req.body.eventId,
        data: req.body.data,
        type,
        by: user._id,
        byName: user.name,
        open: true
    });

    await notifyAdmin("new eventSuggestion by " + user.name + ": " + JSON.stringify(req.body.data));

    const channel = process.env.STAGE === "prod" ? 'C04MQ7Y9S78' : 'U0HJVFER4';
    const suggestionValues = getSuggestionFromDiff(req.body)
    await slack("chat.postMessage", {channel, text: `_${user.name}_ hat einen Terminvorschlag eingereicht:\n*${suggestionValues.date} ${suggestionValues.time} ${suggestionValues.summary}*`})

    res.json(eventSuggestion);

}

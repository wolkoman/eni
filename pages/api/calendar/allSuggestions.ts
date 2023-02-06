import {NextApiRequest, NextApiResponse} from 'next';
import {getCachedEvents, GetEventPermission} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {getCachedReaderData, invalidateCachedReaderData} from "../reader";
import {cockpit} from "../../../util/cockpit-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = resolveUserFromRequest(req);
    const privateAccess = user && user.permissions[Permission.CalendarAdministration];
    if(!privateAccess){
        res.status(401).json({});
        return
    }
    res.json(await cockpit.collectionGet('eventSuggestion', {filter: {open: false}}).then(({entries}) => entries));
}

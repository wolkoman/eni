import {NextApiRequest, NextApiResponse} from 'next';
import {getCachedEvents, GetEventPermission} from '../../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {getCachedReaderData, invalidateCachedReaderData} from "../reader";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = resolveUserFromRequest(req);
    const privateAccess = user && user.permissions[Permission.PrivateCalendarAccess];
    const events = await getCachedEvents({
        permission: privateAccess ? GetEventPermission.PRIVATE_ACCESS : GetEventPermission.PUBLIC,
        getReaderData: getCachedReaderData
    });
    invalidateCachedReaderData();
    res.json(events);
}

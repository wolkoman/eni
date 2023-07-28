import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {loadReaderData} from "../reader";
import {GetEventPermission} from "../../../app/termine/EventMapper";
import {loadEvents} from "../../../app/termine/EventsLoader";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = resolveUserFromRequest(req);
    const privateAccess = user && user.permissions[Permission.PrivateCalendarAccess];
    const readerData = await loadReaderData()
    const events = await loadEvents({
        permission: privateAccess ? GetEventPermission.PRIVATE_ACCESS : GetEventPermission.PUBLIC,
        readerData
    });
    res.json(events);
}

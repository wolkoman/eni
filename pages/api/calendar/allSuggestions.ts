import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {Cockpit} from "../../../util/cockpit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = resolveUserFromRequest(req);
    const privateAccess = user && user.permissions[Permission.CalendarAdministration];
    if(!privateAccess){
        res.status(401).json({});
        return
    }
    res.json(await Cockpit.collectionGet('eventSuggestion', {filter: {open: false}}).then(({entries}) => entries));
}

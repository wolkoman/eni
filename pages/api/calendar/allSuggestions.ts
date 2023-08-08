import {NextApiRequest, NextApiResponse} from 'next';
import {Cockpit} from "../../../util/cockpit";
import {Permission} from "@/domain/users/Permission";
import {resolveUserFromRequest} from "@/domain/users/UserResolver";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = resolveUserFromRequest(req);
    const privateAccess = user && user.permissions[Permission.CalendarAdministration];
    if(!privateAccess){
        res.status(401).json({});
        return
    }
    res.json(await Cockpit.collectionGet('eventSuggestion', {filter: {open: false}}).then(({entries}) => entries));
}

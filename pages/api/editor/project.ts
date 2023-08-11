import {NextApiRequest, NextApiResponse} from 'next';
import {Cockpit} from "@/util/cockpit";
import {Permission} from "@/domain/users/Permission";
import {resolveUserFromRequest} from "@/domain/users/UserResolver";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if(!user?.permissions[Permission.Editor]) {
        res.status(400).end();
        return;
    }

    res.json({
        articles: (await Cockpit.collectionGetUncached('paper_articles', {filter: {project: req.body.projectId}})).entries,
        name: (await Cockpit.collectionGetUncached('paper_projects', {filter: {_id: req.body.projectId}})).entries[0].name,
    });

}

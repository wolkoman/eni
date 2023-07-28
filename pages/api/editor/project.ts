import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from "../../../util/verify";
import {Cockpit} from "../../../util/cockpit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if(!user?.permissions[Permission.Editor]) {
        res.status(400).end();
        return;
    }

    res.json({
        articles: (await Cockpit.collectionGet('paper_articles', {filter: {project: req.body.projectId}})).entries,
        name: (await Cockpit.collectionGet('paper_projects', {filter: {_id: req.body.projectId}})).entries[0].name,
    });

}
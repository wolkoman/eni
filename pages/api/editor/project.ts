import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from "../../../util/verify";
import {cockpit} from "../../../util/cockpit-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if(!user?.permissions[Permission.Editor]) {
        res.status(400).end();
        return;
    }

    res.json({
        articles: (await cockpit.collectionGet('paper_articles', {filter: {project: req.body.projectId}})).entries,
        name: (await cockpit.collectionGet('paper_projects', {filter: {_id: req.body.projectId}})).entries[0].name,
    });

}
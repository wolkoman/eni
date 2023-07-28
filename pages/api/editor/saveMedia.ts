import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from "../../../util/verify";
import {Cockpit} from "../../../util/cockpit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const article = (await Cockpit.collectionGet('paper_articles', {filter: {_id: req.query.articleId as string}})).entries[0];

    if (!article) {
        res.status(400).end();
        return;
    }
    const user = resolveUserFromRequest(req);
    if (article.status !== null && article.status !== 'writing' && !user?.permissions[Permission.Editor]) {
        res.status(401).end();
        return;
    }

    console.log(await Cockpit.collectionSave('paper_articles', {_id: article._id, files: (<string[]>req.body).map(value => ({value}))}));
    res.status(200).json({});

}
import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from "../../../util/verify";
import {cockpit} from "../../../util/cockpit-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const article = (await cockpit.collectionGet('paper_articles', {filter: {_id: req.body.articleId}})).entries[0];

    if(!article){
        res.status(400).end();
        return;
    }
    const user = resolveUserFromRequest(req);
    if(article.status !== 'writing' && !user?.permissions[Permission.Editor]){
        res.status(401).end();
        return;
    }
    if(req.body.status !== 'written' && !user?.permissions[Permission.Editor]){
        res.status(401).end();
        return;
    }

    await cockpit.collectionSave('paper_articles', {...article, status: req.body.status});

    res.status(200).json({});

}
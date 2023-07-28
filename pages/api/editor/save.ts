import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from "../../../util/verify";
import {Cockpit} from "../../../util/cockpit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const article = (await Cockpit.collectionGet('paper_articles', {filter: {_id: req.body.articleId}})).entries[0];

    if (!article) {
        res.status(400).end();
        return;
    }
    const user = resolveUserFromRequest(req);
    if ((article.status !== null && article.status !== 'writing') && !user?.permissions[Permission.Editor]) {
        res.status(401).end();
        return;
    }

    const entries = (await Cockpit.collectionGet('paper_texts', {
        filter: {article: req.body.articleId},
        sort: {_created: -1}
    })).entries;
    const latestText = entries?.[0];
    let latestTextId: string | null = latestText?._id;

    let createNew = latestText?._created + 60*10 < new Date().getTime()/1000;
    if(createNew){
        latestTextId = null;
    }

    await Cockpit.collectionSave('paper_texts', {
        _id: latestTextId ?? undefined,
        article: {_id: req.body.articleId},
        text: req.body.text,
    });

    res.status(200).json({});

}
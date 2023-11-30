import {NextApiRequest, NextApiResponse} from 'next';
import {Cockpit} from "@/util/cockpit";
import {Permission} from "@/domain/users/Permission";
import {resolveUserFromRequest} from "@/domain/users/UserResolver";

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
    res.status(200).json({});

}

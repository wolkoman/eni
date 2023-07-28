import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from "../../../util/verify";
import {slack} from "../../../util/slack";
import {Cockpit} from "../../../util/cockpit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const article = (await Cockpit.collectionGet('paper_articles', {filter: {_id: req.body.articleId}})).entries[0];

    if(!article){
        res.status(400).end();
        return;
    }
    const user = resolveUserFromRequest(req);
    if((article.status !== 'writing' || req.body.status !== 'written') && !user?.permissions[Permission.Editor]){
        res.status(401).end();
        return;
    }

    await Cockpit.collectionSave('paper_articles', {...article, status: req.body.status});

    if(article.project.display.startsWith("EB")){
        const channel = process.env.STAGE === "prod" ? 'C047C4D4R7B' : 'U0HJVFER4';
        const articles = (await Cockpit.collectionGet('paper_articles', {filter: {project: article.project._id as any}})).entries;
        const sameStatus = {
            writing: articles.filter(a => a.status === 'writing'),
            written: articles.filter(a => a.status === 'finished' || a.status === 'corrected' || a.status === 'written'),
            corrected: articles.filter(a => a.status === 'finished' || a.status === 'corrected'),
            finished: articles.filter(a => a.status === 'finished'),
        }[req.body.status as typeof article.status];
        const status = {written: ":writing_hand: geschrieben", writing: "gestartet", finished: ":champagne: fertiggestellt", corrected: ":ok_hand: lektoriert"}[req.body.status as typeof article.status];
        await slack('chat.postMessage', {channel, text: `_${article.name}_ wurde ${status} (${sameStatus.length}/${articles.length})` });
    }


    res.status(200).json({});

}
import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../../util/cockpit-sdk';
import {site} from '../../../util/sites';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const articles = await cockpit.collectionGet('article', {filter: {'platform': site('eni','emmaus')}, sort:{'_created': '-1'}});
    res.status(200).json(articles.entries);
}
import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../../util/cockpit-sdk';
import {siteType, SiteType} from '../../../util/sites';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const articles = await cockpit.collectionGet('article', {filter: {'platform': {[SiteType.ENI]: 'eni',[SiteType.EMMAUS]: 'emmaus'}[siteType]}, sort:{'_created': '-1'}});
    res.status(200).json(articles.entries);
}
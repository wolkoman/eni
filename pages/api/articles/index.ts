import {NextApiRequest, NextApiResponse} from 'next';
import {Cockpit} from "../../../util/cockpit";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const articles = await Cockpit.article({'platform': 'eni'}, {'_o': '1'});
    res.status(200).json(articles);
}
import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../util/cockpit-sdk';
import {doubleHash, resolveUserFromRequest} from '../../util/verify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user?.group !== 'PrivateCalendarAccess' || !req.body.neo || req.body.neo.length < 4) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    await cockpit.collectionSave('person', {
        email: user.email,
        username: user.username,
        active: user.active,
        competences: ['calendar'],
        code: doubleHash(req.body.neo),
        parish: 'all',
        name: user.name
    });
    res.status(200).json({});

}

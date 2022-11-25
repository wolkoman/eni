import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../util/cockpit-sdk';
import {resolvePermissionsForCompetences, resolvePermissionsForGroup} from '../../util/verify';
import {sign} from 'jsonwebtoken';
import {User} from '../../util/user';
import {getPerson} from './change-password';
import {CalendarName} from "../../util/calendar-info";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let body = JSON.parse(req.body);

    const person = await getPerson(body.username, body.password);
    const secretOrPrivateKey = Buffer.from(process.env.PRIVATE_KEY!, 'base64');

    if (person !== null && person !== undefined) {
        delete person.code;
        const permissions = resolvePermissionsForCompetences(person.competences);
        const userlikeObject: User = {...person, permissions, api_key: `person_${person._id}`,  is_person: true};
        await cockpit.collectionSave('person', {...person, last_login: new Date().toISOString()})
        res.json({jwt: sign(userlikeObject, secretOrPrivateKey, {algorithm: 'RS256'})});
    } else if (person === undefined) {
        const cockpitUser = await cockpit.authUser(body.username, body.password);
        if ('message' in cockpitUser) {
            res.status(401).json({});
            return;
        }
        const user: User = {
            ...cockpitUser,
            permissions: resolvePermissionsForGroup(cockpitUser.group),
            parish: CalendarName.ALL,
            username: cockpitUser.user,
            is_person: false
        };
        res.status('error' in user ? 401 : 200).json({jwt: sign(user, secretOrPrivateKey, {algorithm: 'RS256'})});
    } else {
        res.status(401).json({});
    }
}
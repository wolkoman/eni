import {NextApiRequest, NextApiResponse} from 'next';
import {sign} from 'jsonwebtoken';
import {getPerson} from './change-password';
import {setCookie} from "cookies-next";
import {Cockpit} from "../../util/cockpit";
import {cockpit} from "../../util/cockpit-sdk";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {User} from "@/domain/users/User";
import {resolvePermissionsForCompetences, resolvePermissionsForGroup} from "@/domain/users/PermissionResolver";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    let body = JSON.parse(req.body);

    const person = await getPerson(body.username, body.password);
    const secretOrPrivateKey = Buffer.from(process.env.PRIVATE_KEY!, 'base64');

    let user: User;
    if (person) {
        delete person.code;
        user = {
            ...person,
            permissions: resolvePermissionsForCompetences(person.competences),
            api_key: `person_${person._id}`,
            is_person: true
        };
        await Cockpit.collectionSave('person', {...person, last_login: new Date().toISOString()})
    } else {
        const cockpitUser = await cockpit.authUser(body.username, body.password);
        if ('error' in cockpitUser) {
            res.status(401).json({});
            return;
        }
        user = {
            ...cockpitUser,
            permissions: resolvePermissionsForGroup(cockpitUser.group),
            parish: CalendarName.ALL,
            username: cockpitUser.user,
            is_person: false
        };
    }

    const jwt = sign(user, secretOrPrivateKey, {algorithm: 'RS256', expiresIn: "30 days"});
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30);
    setCookie("jwt", jwt, {req, res, expires});
    res.status(200).json({user, expires});
}

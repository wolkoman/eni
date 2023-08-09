import {NextApiRequest, NextApiResponse} from 'next';
import {Collections} from 'cockpit-sdk';
import {Cockpit} from "@/util/cockpit";
import {doubleHash, resolveUserFromRequest} from "@/domain/users/UserResolver";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || !user.is_person) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    const person = await getPerson(user.username, req.body.password);

    if (person === undefined || req.body.neo.length < 4) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    await Cockpit.collectionSave('person', {...person, code: doubleHash(req.body.neo)})
    res.status(200).json({});

}

export async function getPerson(username: string, password: string): Promise<Collections['person'] | undefined >{
    const hashed = doubleHash(password ?? "");
    const personsWithName = (await Cockpit.collectionGet('person', {filter: {username}})).entries;
    const persons = personsWithName
        .filter(person => person.active)
        .filter(person => person.code === password || person.code === hashed || password === undefined);
    return persons.length === 1 ? persons[0] : undefined;
}

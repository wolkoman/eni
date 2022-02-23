import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../util/cockpit-sdk';
import {doubleHash, resolveUserFromRequest} from '../../util/verify';
import {createHash} from 'crypto';
import {Collections} from 'cockpit-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || !user.is_person) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    const person = await getPerson(user.username, req.body.password);
    console.log("person",person);

    if (person === undefined || req.body.neo.length < 4) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    await cockpit.collectionSave('person', {...person, code: doubleHash(req.body.neo)})
    console.log("saving");
    res.status(200).json({});

}

export async function getPerson(username: string, password: string): Promise<Collections['person'] | undefined | null>{
    const hashed = doubleHash(password ?? "");
    const personsWithName = (await cockpit.collectionGet('person', {filter: {username}})).entries;
    const persons = personsWithName
        .filter(person => ((person.code === password || person.code === hashed)) || password === undefined);
    return persons.length === 1 ? persons[0] : (personsWithName.length === 0 ? undefined : null);
}
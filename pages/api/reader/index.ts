import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {cockpit} from "../../../util/cockpit-sdk";
import {ReaderData} from "../../../util/reader";
import {Collections} from "cockpit-sdk";

const READER_ID = "637b85bc376231d51500018d";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || !user.permissions[Permission.Admin]) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    const readerData = await getCachedReaderData();
    const readers = await cockpit.collectionGet("person").then(x => x.entries
        .filter(person => person.competences?.includes('reader') && person.active)
        .map(person => ({
            _id: person._id,
            name: person.name,
            parish: person.parish,
            email: person.email?.includes("@")
        }))
    );

    res.json({readerData, readers: readers});

}

let cachedReadingData: ReaderData | undefined;
let cachedPersonData: Collections['person'][] | undefined;
export const getCachedReaderData = async (): Promise<ReaderData> => {
    if (!cachedReadingData)
        cachedReadingData = await cockpit.collectionGet("internal-data", {filter: {_id: READER_ID}}).then(x => x.entries[0].data)
    return cachedReadingData!;
}
export const getCachedPersonData = async (): Promise<Collections['person'][]> => {
    if (!cachedPersonData)
        cachedPersonData = await cockpit.collectionGet("person").then(x => x.entries)
    return cachedPersonData!;
}
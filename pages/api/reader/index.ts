import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {ReaderData} from "../../../util/reader";
import {Collections} from "cockpit-sdk";
import {CalendarName} from "../../../util/calendar-info";
import {getCachedEvents, GetEventPermission} from "../../../util/calendar-events";
import {Cockpit} from "../../../util/cockpit";

const READER_ID = "637b85bc376231d51500018d";

export const revalidate = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || (!user.permissions[Permission.ReaderPlanning] && !user.permissions[Permission.Reader] && !user.permissions[Permission.CommunionMinister])) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    const readerData = await getCachedReaderData();
    const events = await getCachedEvents(user.permissions[Permission.ReaderPlanning]
        ? {permission: GetEventPermission.PRIVATE_ACCESS, getReaderData: getCachedReaderData}
        : {permission: GetEventPermission.READER, ids: Object.keys(readerData)}
    );
    invalidateCachedReaderData();
    const readers = await Cockpit.collectionGet("person").then(x => x.entries
        .filter(person => (person.competences?.includes('reader') || person.competences?.includes('communion_minister')) && person.active)
        .filter(person => user.parish === CalendarName.ALL || user.parish === person.parish)
        .map(person => ({
            _id: person._id,
            name: person.name,
            parish: person.parish,
            competences: person.competences,
            email: person.email?.includes("@")
        }))
    );

    res.json({readerData, readers, events: events.events});

}

let cachedReadingData: ReaderData | undefined;
let cachedPersonData: Collections['person'][] | undefined;
export const getCachedReaderData = async (): Promise<ReaderData> => {
    if (!cachedReadingData)
        cachedReadingData = await Cockpit.collectionGet("internal-data", {filter: {_id: READER_ID}}).then(x => x.entries[0].data)
    return cachedReadingData!;
}
export const invalidateCachedReaderData = () => {
    cachedReadingData = undefined;
}
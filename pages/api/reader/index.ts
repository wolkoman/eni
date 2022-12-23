import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {cockpit} from "../../../util/cockpit-sdk";
import {ReaderData} from "../../../util/reader";
import {Collections} from "cockpit-sdk";
import {CalendarName} from "../../../util/calendar-info";
import {getCachedEvents, GetEventPermission} from "../../../util/calendar-events";

const READER_ID = "637b85bc376231d51500018d";

export const revalidate = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || (!user.permissions[Permission.ReaderPlanning] && !user.permissions[Permission.Reader])) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    const readerData = await getCachedReaderData();
    const events = await getCachedEvents(user.permissions[Permission.ReaderPlanning]
        ? {permission: GetEventPermission.PRIVATE_ACCESS, getReaderData: getCachedReaderData}
        : {permission: GetEventPermission.READER, ids: Object.keys(readerData)}
    );
    invalidateCachedReaderData();
    const readers = await cockpit.collectionGet("person").then(x => x.entries
        .filter(person => person.competences?.includes('reader') && person.active)
        .filter(person => user.parish === CalendarName.ALL || user.parish === person.parish)
        .map(person => ({
            _id: person._id,
            name: person.name,
            parish: person.parish,
            email: person.email?.includes("@")
        }))
    );

    res.json({readerData, readers, events: events.events});

}

let cachedReadingData: ReaderData | undefined;
let cachedPersonData: Collections['person'][] | undefined;
export const getCachedReaderData = async (): Promise<ReaderData> => {
    if (!cachedReadingData)
        cachedReadingData = await cockpit.collectionGet("internal-data", {filter: {_id: READER_ID}}).then(x => x.entries[0].data)
    return cachedReadingData!;
}
export const invalidateCachedReaderData = () => {
    cachedReadingData = undefined;
}
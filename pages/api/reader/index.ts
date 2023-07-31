import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {ReaderData} from "../../../util/reader";
import {Cockpit} from "../../../util/cockpit";
import {loadEvents} from "../../../app/termine/EventsLoader";
import {GetEventPermission} from "../../../app/termine/EventMapper.server";
import {CalendarName} from "../../../app/termine/CalendarInfo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || (!user.permissions[Permission.ReaderPlanning] && !user.permissions[Permission.Reader] && !user.permissions[Permission.CommunionMinister])) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    const readerData = await loadReaderData();
    const events = await loadEvents(user.permissions[Permission.ReaderPlanning]
        ? {permission: GetEventPermission.PRIVATE_ACCESS, readerData}
        : {permission: GetEventPermission.READER, ids: Object.keys(readerData)}
    );
    const readers = await Cockpit.collectionGet("person")
      .then(x => x.entries
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

export const loadReaderData = (): Promise<ReaderData> => {
    return Cockpit.collectionGet("internal-data", {filter: {_id: Cockpit.InternalId.ReaderData}})
      .then(x => x.entries[0].data)
}

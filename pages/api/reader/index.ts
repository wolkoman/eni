import {NextApiRequest, NextApiResponse} from 'next';
import {Cockpit} from "@/util/cockpit";
import {loadEvents} from "@/domain/events/EventsLoader";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {Permission} from "@/domain/users/Permission";
import {resolveUserFromRequest} from "@/domain/users/UserResolver";
import {ReaderData} from "@/domain/service/Service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || (!user.permissions[Permission.ReaderPlanning] && !user.permissions[Permission.Reader] && !user.permissions[Permission.CommunionMinister])) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    const readerData = await loadReaderData();
    const events = await loadEvents(user.permissions[Permission.ReaderPlanning]
        ? {access: EventLoadAccess.PRIVATE_ACCESS, readerData}
        : {access: EventLoadAccess.READER, ids: Object.keys(readerData)}
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

import {NextApiRequest, NextApiResponse} from 'next';
import {loadReaderData} from "../reader";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {loadEvents} from "@/domain/events/EventsLoader";

import {EventLoadAccess} from "@/domain/events/EventLoadOptions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.query.code !== process.env.DISPLAY_CODE) {
        res.status(500);
        return
    }

    const readerData = await loadReaderData()
    const {events} = await loadEvents({
      access: EventLoadAccess.PRIVATE_ACCESS,
      readerData,
      timeFrame: {
        min: new Date(new Date().getTime() - 1000 * 3600),
        max: new Date(new Date().getTime() + 1000 * 3600 * 24 * 7)
      }
    });

    res.json(events.filter(event => event.groups.some(group => [CalendarGroup.Messe, CalendarGroup.Gottesdienst].includes(group))));
}

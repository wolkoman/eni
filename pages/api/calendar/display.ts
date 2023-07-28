import {NextApiRequest, NextApiResponse} from 'next';
import {site} from "../../../util/sites";
import {loadReaderData} from "../reader";
import {GetEventPermission} from "../../../app/termine/EventMapper";
import {CalendarGroup} from "../../../app/termine/CalendarGroup";
import {CalendarName} from "../../../app/termine/CalendarInfo";
import {loadEvents} from "../../../app/termine/EventsLoader";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (site(true, false) || req.query.code !== process.env.DISPLAY_CODE) {
        res.status(500);
        return
    }

    const readerData = await loadReaderData()
    const {events} = await loadEvents({
        permission: GetEventPermission.PRIVATE_ACCESS,
        readerData,
        timeFrame: {
            min: new Date(new Date().getTime() - 1000 * 3600),
            max: new Date(new Date().getTime() + 1000 * 3600 * 24 * 7)
        }
    });

    res.json(events.filter(event => event.calendar === CalendarName.EMMAUS && event.groups.some(group => [CalendarGroup.Messe, CalendarGroup.Gottesdienst].includes(group))));
}

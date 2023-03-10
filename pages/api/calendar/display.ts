import {NextApiRequest, NextApiResponse} from 'next';
import {getCachedEvents, GetEventPermission} from '../../../util/calendar-events';
import {site} from "../../../util/sites";
import {getCachedReaderData, invalidateCachedReaderData} from "../reader";
import {CalendarName} from "../../../util/calendar-info";
import {CalendarGroup} from "../../../util/calendar-types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (site(true, false) || req.query.code !== process.env.DISPLAY_CODE) {
        res.status(500);
        return
    }

    const {events} = await getCachedEvents({
        permission: GetEventPermission.PRIVATE_ACCESS,
        getReaderData: getCachedReaderData,
        timeFrame: {min: new Date(new Date().getTime() - 1000 * 3600), max: new Date(new Date().getTime() + 1000 * 3600 * 24 * 7)}
    });
    invalidateCachedReaderData();

    res.json(events.filter(event => event.calendar === CalendarName.EMMAUS && event.groups.some(group => [CalendarGroup.Messe, CalendarGroup.Gottesdienst].includes(group))));
}

import {NextApiRequest, NextApiResponse} from 'next';
import {getEvents} from '../../util/calendar-events';
import {Permission, resolveUserFromRequest} from '../../util/verify';
import {cockpit} from "../../util/cockpit-sdk";
import {notifyAdmin} from "../../util/telegram";

const calendarCacheId = "61b335996165305292000383";
export default async function handler(req: NextApiRequest, res: NextApiResponse){

  const user = resolveUserFromRequest(req);

  const privateCalendarAccess = user && user.permissions[Permission.PrivateCalendarAccess];
  const events = (await getEvents({public: !privateCalendarAccess}).catch(() => null));
  if(events !== null){
    if(!privateCalendarAccess){
      cockpit.collectionSave("internal-data",{_id: calendarCacheId, data: {events, cache: new Date().toISOString()}});
    }
    res.json({events, cache: null});
  }else{
    const cachedEvents = await cockpit.collectionGet("internal-data",{filter: {_id: calendarCacheId}});
    res.json(cachedEvents.entries[0].data);
    await notifyAdmin("Google Calendar failed");
  }

}

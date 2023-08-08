"use server"
import {getGoogleAuthClient} from "../(shared)/GoogleAuthClient";
import {site} from "../../util/sites";
import {getTimeOfEvent} from "../../util/get-time-of-event";
import {Cockpit} from "../../util/cockpit";
import {notifyAdmin} from "../../util/telegram";
import {CalendarName} from "./CalendarInfo";
import {resolveUserFromServer} from "../(shared)/UserHandler";
import {Permission} from "../../util/verify";
import {loadReaderData} from "../../pages/api/reader";
import {EventsObject, GetEventOptions, GetEventPermission} from "./EventMapper";
import {loadCalendar} from "./CalendarLoader";

export async function loadEventsFromServer() {
  const user = await resolveUserFromServer();

  const privateAccess = user && user.permissions[Permission.PrivateCalendarAccess];
  const readerData = await (privateAccess ? loadReaderData : () => Promise.resolve(undefined))()
  return await loadEvents({
    permission: privateAccess ? GetEventPermission.PRIVATE_ACCESS : GetEventPermission.PUBLIC,
    readerData
  })
}

export const loadEvents = async (options: GetEventOptions): Promise<EventsObject> => {
  const authClient = await getGoogleAuthClient()
  return Promise.all(site(
      [CalendarName.ALL, CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT],
      [CalendarName.ALL, CalendarName.EMMAUS]
    ).map((name) => loadCalendar(name, options, authClient))
  )
    .then(eventList => eventList.flat()
      .filter(event => !!event)
      .sort((a, b) => getTimeOfEvent(a) - getTimeOfEvent(b))
    )
    .then(async events => {
      if (options.permission === GetEventPermission.PUBLIC && site(true, false)) {
        Cockpit.collectionSave('internal-data', {
          _id: Cockpit.InternalId.CalendarCache,
          data: {events, cache: new Date().toISOString(), openSuggestions: []}
        }).catch();
      }
      const openSuggestions = await (GetEventPermission.PRIVATE_ACCESS === options.permission
        ? () => Cockpit.collectionGet("eventSuggestion", {filter: {open: true}}).then(({entries}) => entries)
        : () => Promise.resolve([]))();
      return {events, openSuggestions};
    })
    .catch(async err => {
      console.log('Google Calendar failed: ' + err);
      await notifyAdmin('Google Calendar failed: ' + err);
      return await Cockpit.collectionGet('internal-data', {filter: {_id: Cockpit.InternalId.CalendarCache}})
        .then(x => x.entries[0].data);
    });
}

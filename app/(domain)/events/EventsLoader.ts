"use server"
import {getGoogleAuthClient} from "../../(shared)/GoogleAuthClient";
import {Cockpit} from "../../../util/cockpit";
import {CalendarName} from "./CalendarInfo";
import {resolveUserFromServer} from "../../(shared)/UserHandler";
import {loadReaderData} from "../../../pages/api/reader";
import {EventsObject} from "./EventMapper";
import {loadCalendar} from "./CalendarLoader";
import {EventLoadOptions, EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {Permission} from "@/domain/users/Permission";
import {notifyAdmin} from "@/app/(shared)/Telegram";
import {site} from "@/app/(shared)/Instance";
import {getTimeOfEvent} from "@/domain/events/EventSorter";

export async function loadEventsFromServer() {
  const user = await resolveUserFromServer();

  const privateAccess = user && user.permissions[Permission.PrivateCalendarAccess];
  const readerData = await (privateAccess ? loadReaderData : () => Promise.resolve(undefined))()
  return await loadEvents({
    access: privateAccess ? EventLoadAccess.PRIVATE_ACCESS : EventLoadAccess.PUBLIC,
    readerData
  })
}

export const loadEvents = async (options: EventLoadOptions): Promise<EventsObject> => {
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
      if (options.access === EventLoadAccess.PUBLIC && site(true, false)) {
        Cockpit.collectionSave('internal-data', {
          _id: Cockpit.InternalId.CalendarCache,
          data: {events, cache: new Date().toISOString(), openSuggestions: []}
        }).catch();
      }
      const openSuggestions = await (EventLoadAccess.PRIVATE_ACCESS === options.access
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

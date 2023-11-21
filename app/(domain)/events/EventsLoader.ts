"use server"
import {getGoogleAuthClient} from "../../(shared)/GoogleAuthClient";
import {Cockpit} from "@/util/cockpit";
import {CalendarName} from "./CalendarInfo";
import {resolveUserFromServer} from "@/app/(shared)/UserHandler";
import {loadReaderData} from "../../../pages/api/reader";
import {EventsObject} from "./EventMapper";
import {loadCalendar} from "./CalendarLoader";
import {EventLoadAccess, EventLoadOptions} from "@/domain/events/EventLoadOptions";
import {Permission} from "@/domain/users/Permission";
import {notifyAdmin} from "@/app/(shared)/Telegram";
import {site} from "@/app/(shared)/Instance";
import {getTimeOfEvent} from "@/domain/events/EventSorter";
import {unstable_cache} from "next/cache";
import { OAuth2Client } from "google-auth-library";

export async function loadEventsFromServer() {
  const user = await resolveUserFromServer();

  const privateAccess = user && user.permissions[Permission.PrivateCalendarAccess];
  const readerData = await (privateAccess ? loadReaderData : () => Promise.resolve(undefined))()
  return await loadCachedEvents({
    access: privateAccess ? EventLoadAccess.PRIVATE_ACCESS : EventLoadAccess.PUBLIC,
    readerData
  })
}

export const loadCachedEvents = async (options: EventLoadOptions): Promise<EventsObject> => {
  const authClient = await getGoogleAuthClient();
  return await unstable_cache(() => loadEvents(options, authClient),
    ["events", JSON.stringify(options)],
    {
      revalidate: 60,
      tags: ["calendar"]
    })()
}

export const loadEvents = async (options: EventLoadOptions, authClient?: OAuth2Client): Promise<EventsObject> => {

  if(!authClient) authClient = await getGoogleAuthClient()
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
      return await Cockpit.collectionGetCached('internal-data', {filter: {_id: Cockpit.InternalId.CalendarCache}})
        .then(x => x.entries[0].data);
    });
}

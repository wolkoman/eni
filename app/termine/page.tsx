import React from 'react';
import EventPage from "./EventPage";
import {getLiturgyDataTill} from "../../pages/api/liturgy";
import {
  getCachedGoogleAuthClient,
  getCalendarEvents,
  GetEventOptions,
  GetEventPermission
} from "../../util/calendar-events";
import {CalendarEvent, EventsObject} from "../../util/calendar-types";
import {site} from "../../util/sites";
import {Cockpit} from "../../util/cockpit";
import {notifyAdmin} from "../../util/telegram";
import {CalendarName} from "../../util/calendar-info";
import {getTimeOfEvent} from "../../util/get-time-of-event";
import {google} from "googleapis";
import {get} from "@vercel/edge-config";

export const revalidate = 300

export default async function () {
  const liturgy = await getLiturgyDataTill(new Date(new Date().getTime() + 1000 * 3600 * 24 * 180))
  const eventsObject = await getEvents({permission: GetEventPermission.PUBLIC})
  return <EventPage liturgy={liturgy} eventsObject={eventsObject}/>
}

const getEvents = async (options: GetEventOptions): Promise<EventsObject> => {
  const config = JSON.parse(await get('google_config') as string)
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_KEY,
  );
  oauth2Client.setCredentials(config);
  const calendarCacheId = '61b335996165305292000383';
  const events = await getEventsDirectly(options).catch(err => {
    console.log(err);
    return null;
  });
  if (events !== null) {
    if (options.permission === GetEventPermission.PUBLIC && site(true, false)) {
      Cockpit.collectionSave('internal-data', {
        _id: calendarCacheId,
        data: {events, cache: new Date().toISOString(), openSuggestions: []}
      }).catch();
    }
    const openSuggestions = await (GetEventPermission.PRIVATE_ACCESS === options.permission
      ? () => Cockpit.collectionGet("eventSuggestion", {filter: {open: true}}).then(({entries}) => entries)
      : () => Promise.resolve([]))();
    return {events, openSuggestions};
  } else {
    const cachedEvents = await Cockpit.collectionGet('internal-data', {filter: {_id: calendarCacheId}}).then(x => x.entries[0].data);
    await notifyAdmin('Google Calendar failed ' + JSON.stringify(events));
    return cachedEvents;
  }
}

async function getEventsDirectly(options: GetEventOptions): Promise<CalendarEvent[]> {
  const oauth2Client = await getCachedGoogleAuthClient()
  return await Promise.all(
    site(
      [CalendarName.ALL, CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT],
      [CalendarName.ALL, CalendarName.EMMAUS]
    )
      .map((name) => getCalendarEvents(name, options, oauth2Client))
  )
    .then(eventList => eventList.flat())
    .then(events => events.filter(event => !!event))
    .then(events => events.sort((a, b) => getTimeOfEvent(a) - getTimeOfEvent(b)));
}
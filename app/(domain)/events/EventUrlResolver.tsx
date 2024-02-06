"use server"
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {getGoogleAuthClient} from "@/app/(shared)/GoogleAuthClient";
import {google} from "googleapis";

export async function getEventUrl(eventId: string, calendar: CalendarName) {
  const calendarId = getCalendarInfo(calendar).calendarId
  const eventData = {auth: await getGoogleAuthClient(), calendarId, eventId};
  return await google.calendar('v3').events.get(eventData).then(event => event.data.htmlLink)
}
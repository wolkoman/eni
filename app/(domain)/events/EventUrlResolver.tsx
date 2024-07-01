"use server"
import {CALENDAR_INFO} from "@/domain/events/CalendarInfo";
import {getGoogleAuthClient} from "@/app/(shared)/GoogleAuthClient";
import {google} from "googleapis";

export async function getEventUrl(eventId: string) {
  const calendarId = CALENDAR_INFO.calendarId
  const eventData = {auth: await getGoogleAuthClient(), calendarId, eventId};
  return await google.calendar('v3').events.get(eventData).then(event => event.data.htmlLink)
}
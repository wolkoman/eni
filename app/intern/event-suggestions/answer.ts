"use server"

import {google} from "googleapis";
import {Cockpit} from "@/util/cockpit";
import {getGoogleAuthClient} from "@/app/(shared)/GoogleAuthClient";
import {mapEvent} from "@/domain/events/EventMapper";
import {CALENDAR_INFO} from "@/domain/events/CalendarInfo";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {applySuggestionToPatch, getSuggestionFromDiff} from "@/domain/suggestions/SuggestionsMapper";
import {Permission} from "@/domain/users/Permission";
import {sendMail} from "@/app/(shared)/Mailjet";
import {resolveUserFromServer} from "../../(shared)/UserHandler";


export async function answerEventSuggestions(suggestionId: string, accept: boolean, reason?: string) {
  return await new Promise<string>(async (res, rej) => {

    const user = await resolveUserFromServer();
    if (!user?.permissions[Permission.CalendarAdministration]) {
      rej("Unauthorized");
      return
    }

    const eventSuggestions = await Cockpit.collectionGet("eventSuggestion", {
      filter: {
        open: true,
        _id: suggestionId
      }
    }).then(({entries}) => entries);

    if (eventSuggestions.length !== 1) {
      rej("Suggestion doesnt exist");
      return
    }
    const suggestion = eventSuggestions[0];
    const suggestionParish = CALENDAR_INFO;
    const suggestionValues = getSuggestionFromDiff(suggestion);

    if (!accept) {
      await Cockpit.collectionSave("eventSuggestion", {
        _id: eventSuggestions[0]._id,
        accepted: false,
        open: false,
        closedBy: user._id,
        closedByName: user.name
      });
      if (user.email) {
        await sendMail(4570749, user.name, user.email, "Abgelehnter Termin: " + suggestionValues.summary, {
          summary: suggestionValues.summary,
          dateandtime: new Date(suggestionValues.date + "T" + suggestionValues.time).toLocaleString("de-AT", {timeZone: "Europe/Vienna"}),
          description: suggestionValues.description,
          name: user.name,
          reason: reason
        })
      }
      res("")
      return;
    }

    const eventData = {
      auth: await getGoogleAuthClient(),
      calendarId: suggestionParish.calendarId,
      eventId: suggestion.eventId
    };
    const existingGoogleEvent = await (suggestion.eventId
        ? google.calendar('v3').events.get(eventData).then(event => event.data)
        : Promise.resolve(undefined)
    );
    const existingEvent = mapEvent({access: EventLoadAccess.PRIVATE_ACCESS})(existingGoogleEvent);
    const patchedSuggestion = getSuggestionFromDiff(applySuggestionToPatch(suggestion, existingEvent ?? undefined).suggestion);

    const patchedEvent = {
      description: patchedSuggestion.description,
      summary: patchedSuggestion.summary,
      start: {
        dateTime: `${patchedSuggestion.date}T${patchedSuggestion.time}:00`,
        timeZone: 'Europe/Vienna'
      },
      end: {
        dateTime: `${patchedSuggestion.date}T${patchedSuggestion.time.split(":").map((a, b) => +a + (1 - b)).join(":")}:00`,
        timeZone: 'Europe/Vienna'
      }
    }

    const htmlLink = await (suggestion.type === "add"
        ? google.calendar('v3').events.insert({
          auth: await getGoogleAuthClient(),
          calendarId: suggestionParish.calendarId,
          requestBody: patchedEvent
        })
        : google.calendar('v3').events.patch({
          ...eventData,
          requestBody: {
            ...patchedEvent,
            summary: patchedEvent.summary + (existingEvent?.mainPerson ? `/${existingEvent?.mainPerson}` : "")
          }
        })
    ).then((event) => event.data.htmlLink as string);
    await Cockpit.collectionSave("eventSuggestion", {
      _id: eventSuggestions[0]._id,
      accepted: true,
      open: false,
      closedBy: user._id,
      closedByName: user.name
    });
    res(htmlLink)
  })
}

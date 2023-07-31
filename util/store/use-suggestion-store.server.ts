"use server"
import {resolveUserFromServer} from "../../app/(shared)/UserHandler";
import {Permission} from "../verify";
import {Cockpit} from "../cockpit";

export async function getAllSuggestionFromServer() {
  const user = await resolveUserFromServer();
  const privateAccess = user && user.permissions[Permission.CalendarAdministration];
  if (!privateAccess) {
    return []
  }
  return await Cockpit.collectionGet('eventSuggestion', {filter: {open: false}}).then(({entries}) => entries);
}
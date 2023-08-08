"use server"
import {Cockpit} from "../../../util/cockpit";
import {User} from "../../../util/user";

export async function getAllSuggestionFromServer() {
  const user: undefined | User = undefined;//await resolveUserFromServer();
  const privateAccess = false; //user && user.permissions[Permission.CalendarAdministration];
  if (!privateAccess) {
    return []
  }
  return await Cockpit.collectionGet('eventSuggestion', {filter: {open: false}}).then(({entries}) => entries);
}

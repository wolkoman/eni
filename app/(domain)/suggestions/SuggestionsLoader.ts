"use server"
import {Cockpit} from "../../../util/cockpit";

import {User} from "../users/User";
import {resolveUserFromServer} from "../../(shared)/UserHandler";
import {Permission} from "../users/Permission";

export async function getAllSuggestionFromServer() {
  const user = await resolveUserFromServer();
  const privateAccess = user && user.permissions[Permission.CalendarAdministration];
  if (!privateAccess) {
    return []
  }
  return await Cockpit.collectionGetUncached('eventSuggestion', {filter: {open: false}}).then(({entries}) => entries);
}

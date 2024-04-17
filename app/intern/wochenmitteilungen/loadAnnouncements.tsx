"use server"
import {Cockpit} from "@/util/cockpit";
import {resolveUserFromServer} from "../../(shared)/UserHandler";
import {Permission} from "@/domain/users/Permission";

export async function loadAnnouncements() {
    const user = await resolveUserFromServer()
    if(!user?.permissions[Permission.CalendarAdministration]) throw new Error("No authorization")
    return Cockpit.collectionGet('announcements', {
        filter: {hidden: false}
    });
}

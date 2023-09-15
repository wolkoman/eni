"use server"
import {Cockpit} from "../../../util/cockpit";
import {resolveUserFromServer} from "../../(shared)/UserHandler";
import {Permission} from "../../(domain)/users/Permission";
import {revalidateTag} from "next/cache";

export async function hideAnnouncement(id: string) {
    const user = await resolveUserFromServer()
    if(!user?.permissions[Permission.CalendarAdministration]) throw new Error("No authorization")
    await Cockpit.collectionSave('announcements', {_id: id, hidden: true});
    revalidateTag(`cockpit-announcements`)
}

"use server"
import {Cockpit} from "../../../util/cockpit";
import {resolveUserFromServer} from "../../(shared)/UserHandler";

export async function saveAnnouncement(param: {
    hidden: boolean;
    by: any;
    description: string;
    files: string[];
    byName: any
}) {
    const user = await resolveUserFromServer();
    if(!user) throw Error("Not logged in")
    await Cockpit.collectionSave('announcements', param)
}

"use server";
import {Cockpit} from "../../../util/cockpit";
import {resolveUserFromServer} from "../../(shared)/UserHandler";
import {Permission} from "../../(domain)/users/Permission";

export async function uploadWeekly(date: string, wm0: string, wm1: string, wm2: string) {
    const user = await resolveUserFromServer()
    if(!user?.permissions[Permission.CalendarAdministration]) throw new Error("No authorization")
    const existing = await Cockpit.collectionGet("weekly", {filter: {date}}).then(({entries}) => entries);
    await Cockpit.collectionSave(`weekly`, {
        date,
        _id: existing?.[0]?._id,
        emmaus: wm0,
        inzersdorf: wm1,
        neustift: wm2
    })
}

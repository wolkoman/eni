"use server"
import {Permission} from "../../util/verify";
import {loadEvents} from "./EventsLoader";
import {GetEventPermission} from "./EventMapper.server";
import {loadReaderData} from "../../pages/api/reader";
import {resolveUserFromServer} from "../(shared)/UserHandler";

export default async function loadEventsFromServer() {
    const user = await resolveUserFromServer();
    const privateAccess = user && user.permissions[Permission.PrivateCalendarAccess];
    const readerData = await (privateAccess ? loadReaderData : () => Promise.resolve(undefined))()
    return await loadEvents({
        permission: privateAccess ? GetEventPermission.PRIVATE_ACCESS : GetEventPermission.PUBLIC,
        readerData
    });
}

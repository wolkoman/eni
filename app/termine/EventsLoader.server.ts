"use server"
//import {resolveUserFromServer} from "../(shared)/UserHandler";

export default async function loadEventsFromServer() {
    //const user = await resolveUserFromServer();
    return {
        events: [],
        openSuggestions: []
    } ;/*
    const privateAccess = false; //user && user.permissions[Permission.PrivateCalendarAccess];
    const readerData = await (privateAccess ? loadReaderData : () => Promise.resolve(undefined))()
    return await loadEvents({
        permission: privateAccess ? GetEventPermission.PRIVATE_ACCESS : GetEventPermission.PUBLIC,
        readerData
    });*/
}

import {CalendarName} from "@/domain/events/CalendarInfo";

import {Permissions} from "@/domain/users/Permission";

export interface User {
    name: string,
    email?: string,
    group?: string,
    parish: CalendarName,
    permissions: Permissions,
    is_person: boolean
    _id: string,
    username: string,
    active: boolean,
    api_key: string,
}

import {Permissions} from './verify';

import {CalendarName} from "../app/termine/CalendarInfo";
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

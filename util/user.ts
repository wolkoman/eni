import {Permissions} from './verify';

export interface User {
    name: string,
    email?: string,
    group?: string,
    parish: 'all' | 'emmaus' | 'inzersdorf' | 'neustift',
    permissions: Permissions,
    is_person: boolean
    _id: string,
    username: string,
    active: boolean,
    api_key: string,
}
import {ReaderData} from "@/domain/service/Service";

export enum EventLoadAccess {
    PUBLIC = "PUBLIC",
    PRIVATE_ACCESS = "PRIVATE_ACCESS",
    READER = "READER",
}

export type EventLoadOptions =
    { access: EventLoadAccess.PUBLIC }
    | {
    access: EventLoadAccess.PRIVATE_ACCESS,
    timeFrame?: { min: Date, max: Date },
    readerData?: ReaderData
}
    | { access: EventLoadAccess.READER, ids: string[] }

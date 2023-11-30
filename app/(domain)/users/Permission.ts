export enum Permission {
    Articles = "ARTICLES",
    PrivateCalendarAccess = "PRIVATE_CALENDAR_ACCESS",
    OrganBooking = "ORGAN_BOOKING",
    Editor = "EDITOR",
    LimitedEventEditing = "LIMITING_EVENT_EDITING",
    Admin = "ADMIN",
    Reader = "READER",
    ReaderPlanning = "READER_PLANNING",
    CalendarAdministration = "CALENDAR_ADMINISTRATION",
    CommunionMinister = "COMMUNION_MINISTER",
    PrivateDocumentAccess = "PrivateDocumentAccess"
}

export type Permissions = Partial<Record<Permission, boolean>>;

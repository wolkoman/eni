export enum Permission {
    Articles = "ARTICLES",
    PrivateCalendarAccess = "PRIVATE_CALENDAR_ACCESS",
    OrganBooking = "ORGAN_BOOKING",
    Editor = "EDITOR",
    Admin = "ADMIN",
    Reader = "READER",
    ReaderPlanning = "READER_PLANNING",
    CalendarAdministration = "CALENDAR_ADMINISTRATION",
    CommunionMinister = "COMMUNION_MINISTER",
}

export type Permissions = Partial<Record<Permission, boolean>>;

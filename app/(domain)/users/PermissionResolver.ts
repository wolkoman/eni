import {Collections, User as CockpitUser} from "cockpit-sdk";
import {Permission, Permissions} from "@/domain/users/Permission";

export function resolvePermissionsForGroup(group: CockpitUser['group'] = ''): Permissions {
    return {
        [Permission.CalendarAdministration]: ['admin', 'master'].includes(group),
        [Permission.CommunionMinister]: ['admin', 'master'].includes(group),
        [Permission.Articles]: ['admin', 'master'].includes(group),
        [Permission.PrivateCalendarAccess]: ['PrivateCalendarAccess', 'OrganMaster', 'admin', 'master'].includes(group),
        [Permission.Admin]: ['admin', 'master'].includes(group),
        [Permission.Reader]: ['admin', 'master'].includes(group),
        [Permission.ReaderPlanning]: ['admin', 'master'].includes(group),
        [Permission.Editor]: ['admin', 'master', 'ArticleEditor'].includes(group),
    };
}

export function resolvePermissionsForCompetences(competences: Collections['person']['competences']): Permissions {
    return {
        [Permission.CalendarAdministration]: competences.includes("calendar_administration"),
        [Permission.Articles]: competences.includes("admin"),
        [Permission.PrivateCalendarAccess]: competences.includes("calendar"),
        [Permission.Editor]: competences.includes("editor"),
        [Permission.Admin]: competences.includes("admin"),
        [Permission.Reader]: competences.includes("reader"),
        [Permission.CommunionMinister]: competences.includes("communion_minister"),
        [Permission.ReaderPlanning]: competences.includes("reader_planning"),
    };
}

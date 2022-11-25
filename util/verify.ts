import {Collections, User as CockpitUser} from 'cockpit-sdk';
import {verify} from 'jsonwebtoken';
import {NextApiRequest} from 'next';
import {User} from './user';
import {BinaryToTextEncoding, createHash} from 'crypto';

export enum Permission {
  Articles = "ARTICLES",
  PrivateCalendarAccess = "PRIVATE_CALENDAR_ACCESS",
  OrganBooking = "ORGAN_BOOKING",
  Editor = "EDITOR",
  LimitedEventEditing = "LIMITING_EVENT_EDITING",
  Admin = "ADMIN",
  Reader = "READER",
  ReaderPlanning = "READER_PLANNING",
}
export type Permissions = Partial<Record<Permission, boolean>>;

export function resolvePermissionsForGroup(group: CockpitUser['group'] = ''): Permissions {
  return {
    [Permission.Articles]: ['admin', 'master'].includes(group),
    [Permission.PrivateCalendarAccess]: ['PrivateCalendarAccess', 'OrganMaster', 'admin', 'master'].includes(group),
    [Permission.Admin]: ['admin', 'master'].includes(group),
    [Permission.Reader]: ['admin', 'master'].includes(group),
    [Permission.ReaderPlanning]: ['admin', 'master'].includes(group),
    [Permission.Editor]: ['admin', 'master', 'ArticleEditor'].includes(group),
    [Permission.OrganBooking]: ['admin', 'OrganAccess', 'OrganMaster'].includes(group),
    [Permission.LimitedEventEditing]: ['admin', 'master', 'OrganMaster'].includes(group),
  };
}

export function resolvePermissionsForCompetences(competences: Collections['person']['competences']): Permissions {
  return {
    [Permission.Articles]: competences.includes("admin"),
    [Permission.PrivateCalendarAccess]: competences.includes("calendar"),
    [Permission.LimitedEventEditing]: competences.includes("limited_event_editing"),
    [Permission.Editor]: competences.includes("editor"),
    [Permission.Admin]: competences.includes("admin"),
    [Permission.Reader]: competences.includes("reader"),
    [Permission.ReaderPlanning]: competences.includes("reader_planning"),
    [Permission.OrganBooking]: competences.includes("organ")
  };
}

export function resolveUserFromRequest(req: NextApiRequest): User | undefined{
  const jwt = req.headers.authorization?.split("Bearer ")?.[1];
  if(jwt === undefined) return undefined;
  return resolveUser(jwt);
}

export function resolveUser(jwt: string): User | undefined{
  try{
    const user = verify(jwt, Buffer.from(process.env.NEXT_PUBLIC_KEY!, 'base64')) as User | undefined;
    if(user === undefined) return undefined;
    return {...user};
  }catch (e){
    return undefined;
  }
}
export function doubleHash(password: string, hash = 'sha256', encoding: BinaryToTextEncoding = 'base64'){
  return createHash(hash).update(createHash(hash).update(password).digest(encoding)).digest(encoding);
}
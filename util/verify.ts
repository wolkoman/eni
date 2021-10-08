import {Collections, User} from 'cockpit-sdk';
import {verify} from 'jsonwebtoken';
import {NextApiRequest} from 'next';

export enum Permission {
  Articles,
  ReaderPlanning,
  PrivateCalendarAccess,
  OrganBooking,
  ExperimentalAccess
}
export type Permissions = Partial<Record<Permission, boolean>>;

export function resolvePermissions(group: User['group'] = ''): Permissions {
  return {
    [Permission.Articles]: ['admin'].includes(group),
    [Permission.PrivateCalendarAccess]: ['PrivateCalendarAccess', 'admin'].includes(group),
    [Permission.ReaderPlanning]: ['admin'].includes(group),
    [Permission.ExperimentalAccess]: ['admin'].includes(group),
    [Permission.OrganBooking]: ['admin', 'OrganAccess'].includes(group)
  };
}

export function resolveGroup(competences: Collections['person']['competences']): User['group'] {
  if(competences.includes('organ')){
    return 'OrganAccess';
  }
  return '';
}

export function resolveUserFromRequest(req: NextApiRequest): (User & {permissions: Permissions}) | undefined{
  const jwt = req.headers.authorization?.split("Bearer ")?.[1];
  if(jwt === undefined) return undefined;
  return resolveUser(jwt);
}

export function resolveUser(jwt: string): (User & {permissions: Permissions}) | undefined{
  try{
    const user = verify(jwt, Buffer.from(process.env.NEXT_PUBLIC_KEY!, 'base64')) as User | undefined;
    if(user === undefined) return undefined;
    return {...user, permissions: resolvePermissions(user.group)};
  }catch (e){
    return undefined;
  }
}
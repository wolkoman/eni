import {NextApiRequest} from "next";
import {User} from "@/domain/users/User";
import {getCookie} from "cookies-next";
import {verify} from "jsonwebtoken";
import {BinaryToTextEncoding, createHash} from "crypto";

export function resolveUser(jwt: string): User | undefined {
  try {
    const user = verify(jwt, Buffer.from(process.env.NEXT_PUBLIC_KEY!, 'base64')) as User | undefined;
    if (user === undefined) return undefined;
    return {...user};
  } catch (e) {
    return undefined;
  }
}

export function doubleHash(password: string, hash = 'sha256', encoding: BinaryToTextEncoding = 'base64') {
  return createHash(hash).update(createHash(hash).update(password).digest(encoding)).digest(encoding);
}

export function resolveUserFromRequest(req: NextApiRequest): User | undefined {
    const jwt = getCookie('jwt', {req})
    if (!jwt || jwt === true) return undefined;
    return resolveUser(jwt);
}

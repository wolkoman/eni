"use server";
import {User} from "../../util/user";
import {resolveUser} from "../../util/verify";
import {cookies} from "next/headers";

export async function resolveUserFromServer(): Promise<User | undefined>{
  const jwt = cookies().get('jwt')?.value
  console.log({jwt})
  if(!jwt) return undefined;
  return resolveUser(jwt);
}
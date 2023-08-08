"use server";
import {cookies} from "next/headers";
import {User} from "@/domain/users/User";
import {resolveUser} from "@/domain/users/UserResolver";

export async function resolveUserFromServer(): Promise<User | undefined>{
  const jwt = cookies().get('jwt')?.value
  if(!jwt) return undefined;
  return resolveUser(jwt);
}

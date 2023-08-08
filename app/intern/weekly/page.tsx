import React from "react";
import {WeeklyPage} from "./weekly";

export const revalidate = 300

export default async function HomePage() {
  return <WeeklyPage/>
}

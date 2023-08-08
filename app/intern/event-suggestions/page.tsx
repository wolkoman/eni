import React from "react";
import {EventSuggestionsPage} from "./EventSuggestionsPage";

export const revalidate = 300

export default async function HomePage() {
  return <EventSuggestionsPage/>
}

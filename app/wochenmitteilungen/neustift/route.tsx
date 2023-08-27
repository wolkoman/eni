import {fetchCurrentWeeklies, fetchWeeklyEdition} from "../../(shared)/Weekly";
import {NextResponse} from "next/server";
import {CalendarName} from "../../(domain)/events/CalendarInfo";

export async function GET() {
  return NextResponse.redirect(fetchWeeklyEdition(await fetchCurrentWeeklies(), CalendarName.NEUSTIFT));
}
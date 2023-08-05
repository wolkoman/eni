import React from 'react';
import Link from "next/link";
import Site from "../../components/Site";
import {site} from "../../util/sites";
import {getCockpitResourceUrl} from "../../components/Articles";
import {fetchEmmausbote, fetchWeeklies} from "../../util/fetchWeeklies";
import {CalendarName, getCalendarInfo} from "../termine/CalendarInfo";

export default async function HomePage() {

    const calendars = [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT].map(name => getCalendarInfo(name));
    return <>
        <Site title="Archiv">
            {await site(async () => <>
                <div className="text-3xl font-bold">Wochenmitteilungen</div>
                <div className="my-4 mb-16">
                    <div className="my-0.5 flex font-bold space-x-2">
                        <div className="w-24"></div>
                        {calendars.map(calendar => <div
                            className={"w-24 rounded px-1 py-0.,5 text-center " + calendar.className}>{calendar.shortName}</div>)}
                    </div>
                    {(await fetchWeeklies())
                        .filter(weekly => weekly.emmaus && weekly.inzersdorf && weekly.neustift)
                        .map(weekly => <div className="my-0.5 flex space-x-2">
                            <div className="w-24">{new Date(weekly.date).toLocaleDateString()}</div>
                            {calendars.map(calendar =>
                                <div className="w-24 text-center">
                                    <Link href={getCockpitResourceUrl(weekly[calendar.id as 'emmaus'])}>Link</Link>
                                </div>)
                            }
                        </div>)}
                </div>
            </>, async () => <>
                <div className="text-3xl font-bold">Emmausbote</div>
                <div className="flex flex-wrap mb-12">
                    {(await fetchEmmausbote())
                        .map(issue => <Link href={getCockpitResourceUrl(issue.file)}><img
                            src={getCockpitResourceUrl(issue.preview.path)}
                            className="w-60 rounded m-2 hover:scale-105 cursor-pointer transition"
                        /></Link>)}
                </div>
            </>)()}
        </Site>
    </>;
}

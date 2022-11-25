import React, {ReactNode} from 'react';
import Site from '../../../components/Site';
import {getLiturgyData, LiturgyData} from "../../api/liturgy";
import {useAuthenticatedReaderStore} from "../../../util/use-reader-store";
import Responsive from "../../../components/Responsive";
import {CalendarName} from "../../../util/calendar-info";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import {useAuthenticatedCalendarStore} from "../../../util/use-calendar-store";
import {useAuthenticatedUserStore} from "../../../util/use-user-store";
import {Permission} from "../../../util/verify";

export default function Index(props: { liturgy: LiturgyData }) {

    return <ReaderSite>
    </ReaderSite>;
}

export function ReaderSite(props: { children: ReactNode }) {

    const {user} = useAuthenticatedUserStore();
    const {parish, setParish, ...reader} = useAuthenticatedReaderStore();
    const belongsTo = (calendar: CalendarName) => user?.parish === CalendarName.ALL || user?.parish === calendar;

    const inactive = 'grayscale opacity-20 contrast-50 cursor-pointer';
    return <Site title="Lektor:innen" responsive={false}>
        <div className="flex flex-col lg:flex-row">
            <div>
                <div
                    className="flex lg:flex-col h-20 lg:h-auto lg:w-20 p-4 gap-2 bg-black/5 rounded-r-xl grow-0 lg:sticky top-0">
                    <img src="/logo/emmaus.svg"
                         onClick={() => setParish(CalendarName.EMMAUS)}
                         className={`${parish === CalendarName.EMMAUS ? '' : inactive} ${belongsTo(CalendarName.EMMAUS) || 'hidden'}`}/>
                    <img src="/logo/inzersdorf.svg"
                         onClick={() => setParish(CalendarName.INZERSDORF)}
                         className={`${parish === CalendarName.INZERSDORF ? '' : inactive} ${belongsTo(CalendarName.INZERSDORF) || 'hidden'}`}/>
                    <img src="/logo/neustift.svg"
                         onClick={() => setParish(CalendarName.NEUSTIFT)}
                         className={`${parish === CalendarName.NEUSTIFT ? '' : inactive} ${belongsTo(CalendarName.NEUSTIFT) || 'hidden'}`}/>
                    <Link href="/intern/reader/my">
                        <img src="/logo/persons.svg" className="cursor-pointer"/>
                    </Link>
                    {user?.permissions[Permission.Admin] && <>
                        <Link href="/intern/reader/events">
                            <img src="/logo/events.svg" className="cursor-pointer"/>
                        </Link>
                        <Link href="/intern/reader/notifications">
                            <img src="/logo/notifications.svg" className="cursor-pointer"/>
                        </Link>
                    </>}
                </div>
            </div>
            <Responsive>
                {reader.loading || reader.error
                    ? <>Daten werden geladen...</>
                    : <>{props.children} </>
                }
            </Responsive>
        </div>
    </Site>
}

export async function getStaticProps() {
    return {
        props: {
            liturgy: await getLiturgyData(),
        },
        revalidate: 3600 * 24,
    }
}
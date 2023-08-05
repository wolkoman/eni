"use client"
import React, {ReactNode} from 'react';
import Site from '../../../components/Site';
import {useAuthenticatedReaderStore} from "../../../util/store/use-reader-store";
import Responsive from "../../../components/Responsive";
import Link from "next/link";
import {useAuthenticatedUserStore} from "../../../util/store/use-user-store";
import {Permission} from "../../../util/verify";
import {EniLoading} from "../../../components/Loading";
import {CalendarName} from "../../../app/termine/CalendarInfo";

export function ReaderSite(props: { children?: ReactNode }) {

    const {user} = useAuthenticatedUserStore();
    const {parish, setParish, ...reader} = useAuthenticatedReaderStore();
    const belongsTo = (calendar: CalendarName) => user?.parish === CalendarName.ALL || user?.parish === calendar;

    const inactive = 'grayscale opacity-20 contrast-50 cursor-pointer';
    return <Site title="Liturgische Dienste" responsive={false}>
        <div className="flex flex-col lg:flex-row">
            <div className="print:hidden">
                <div
                    className="flex lg:flex-col h-20 lg:h-auto lg:w-20 p-4 gap-2 bg-black/5 rounded-r-xl grow-0 lg:sticky top-0">
                    <img src="/dot/edot.svg"
                         onClick={() => setParish(CalendarName.EMMAUS)}
                         className={`${parish === CalendarName.EMMAUS ? '' : inactive} ${belongsTo(CalendarName.EMMAUS) || 'hidden'}`}/>
                    <img src="/dot/idot.svg"
                         onClick={() => setParish(CalendarName.INZERSDORF)}
                         className={`${parish === CalendarName.INZERSDORF ? '' : inactive} ${belongsTo(CalendarName.INZERSDORF) || 'hidden'}`}/>
                    <img src="/dot/ndot.svg"
                         onClick={() => setParish(CalendarName.NEUSTIFT)}
                         className={`${parish === CalendarName.NEUSTIFT ? '' : inactive} ${belongsTo(CalendarName.NEUSTIFT) || 'hidden'}`}/>
                    <Link href="/intern/reader/my" legacyBehavior={true}>
                        <img src="/logo/persons.svg" className="cursor-pointer"/>
                    </Link>
                    {user?.permissions[Permission.ReaderPlanning] && <>
                        <Link href="/intern/reader/events" legacyBehavior={true}>
                            <img src="/logo/events.svg" className="cursor-pointer"/>
                        </Link>
                        <Link href="/intern/reader/notifications" legacyBehavior={true}>
                            <img src="/logo/notifications.svg" className="cursor-pointer"/>
                        </Link>
                    </>}
                </div>
            </div>
            <Responsive>
                {reader.loading || reader.error
                    ? <><EniLoading/></>
                    : <>{props.children} </>
                }
            </Responsive>
        </div>
    </Site>
}
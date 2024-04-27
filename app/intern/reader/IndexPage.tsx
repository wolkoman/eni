"use client"
import React, {ReactNode} from 'react';
import Site from '../../../components/Site';
import {useReaderStore} from "@/store/ReaderStore";
import Responsive from "../../../components/Responsive";
import Link from "next/link";
import {EniLoading} from "../../../components/Loading";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {useUserStore} from "@/store/UserStore";
import {Permission} from "@/domain/users/Permission";
import {Links} from "@/app/(shared)/Links";
import {SiteBar} from "@/app/intern/SiteBar";
import Button from "../../../components/Button";
import {PiEnvelopeBold, PiListBold, PiPencilBold} from "react-icons/pi";

export function ReaderSite(props: { children?: ReactNode }) {

    const user = useUserStore(state => state.user);
    const {parish, setParish, ...reader} = useReaderStore(state => state);
    const belongsTo = (calendar: CalendarName) => user?.parish === CalendarName.ALL || user?.parish === calendar;

    const inactive = 'grayscale opacity-20 contrast-50 cursor-pointer';
    return <Site title="Liturgische Dienste" responsive={false}>
        <SiteBar>
            <div className="flex gap-1">
                {belongsTo(CalendarName.EMMAUS) &&
                    <img src="/dot/edot.svg"
                         onClick={() => setParish(CalendarName.EMMAUS)}
                         className={`w-10 ${parish === CalendarName.EMMAUS ? '' : inactive}`}
                    />}
                {belongsTo(CalendarName.INZERSDORF) &&
                    <img src="/dot/idot.svg"
                         onClick={() => setParish(CalendarName.INZERSDORF)}
                         className={`w-10 ${parish === CalendarName.INZERSDORF ? '' : inactive}`}
                    />}
                {belongsTo(CalendarName.NEUSTIFT) &&
                    <img src="/dot/ndot.svg"
                         onClick={() => setParish(CalendarName.NEUSTIFT)}
                         className={`w-10 ${parish === CalendarName.NEUSTIFT ? '' : inactive}`}
                    />}
            </div>
            <div className="flex gap-1">
                {user?.permissions[Permission.ReaderPlanning] && <>
                    <Link href={Links.DiensteÜbersicht}><Button label="Übersicht" icon={PiListBold}/></Link>
                    <Link href={Links.DienstePlanung}><Button label="Planung" icon={PiPencilBold}/></Link>
                    <Link href={Links.DiensteBenachrichtigung}><Button label="Benachrichtigung" icon={PiEnvelopeBold}/></Link>
                </>}
            </div>
        </SiteBar>
        <Responsive className="mt-8">
            {reader.loading || reader.error
                ? <><EniLoading/></>
                : <>{props.children} </>
            }
        </Responsive>
    </Site>
}

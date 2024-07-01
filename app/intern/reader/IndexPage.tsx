"use client"
import React, {ReactNode} from 'react';
import Site from '../../../components/Site';
import {useReaderStore} from "@/store/ReaderStore";
import Responsive from "../../../components/Responsive";
import Link from "next/link";
import {EniLoading} from "@/components/Loading";
import {useUserStore} from "@/store/UserStore";
import {Permission} from "@/domain/users/Permission";
import {Links} from "@/app/(shared)/Links";

export function ReaderSite(props: { children?: ReactNode }) {

    const user = useUserStore(state => state.user);
    const reader = useReaderStore(state => state);

    const inactive = 'grayscale opacity-20 contrast-50 cursor-pointer';
    return <Site title="Liturgische Dienste" responsive={false}>
        <div className="flex flex-col lg:flex-row">
            <div className="print:hidden">
                <div
                    className="flex lg:flex-col h-20 lg:h-auto lg:w-20 p-4 gap-2 bg-black/5 rounded-r-xl grow-0 lg:sticky top-0">
                    <Link href={Links.DiensteÜbersicht}>
                        <img src="/logo/persons.svg" className="w-12 cursor-pointer"/>
                    </Link>
                    {user?.permissions[Permission.ReaderPlanning] && <>
                        <Link href={Links.DienstePlanung}>
                            <img src="/logo/events.svg" className="w-12 cursor-pointer"/>
                        </Link>
                        <Link href={Links.DiensteBenachrichtigung}>
                            <img src="/logo/notifications.svg" className="w-12 cursor-pointer"/>
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

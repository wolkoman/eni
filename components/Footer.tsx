"use client"

import Link from 'next/link';
import React, {ReactNode} from 'react';
import Responsive from './Responsive';
import Button from "./Button";
import {useUserStore} from "@/store/UserStore";
import {site} from "@/app/(shared)/Instance";
import {Links} from "@/app/(shared)/Links";

function Title(props: { children: ReactNode }) {
    return <div className="font-bold uppercase tracking-wide my-2">{props.children}</div>;
}

export default function Footer() {
    const user = useUserStore(state => state.user);
    return <>
        <div className="py-6 text-neutral-600 pt-12 mt-12 print:hidden text-sm">
            <Responsive>
                <div className="grid lg:grid-cols-3 gap-3">
                    <div>
                        <Title>Kontakt</Title>
                        {site(<>
                            Zentralbüro der drei Pfarren<br/>
                            Draschestraße 105, 1230 Wien<br/>
                            <a href="tel:+4366488632680">+43 664 886 32 680</a><br/>
                            <a href="mailto:kanzlei@eni.wien">kanzlei@eni.wien</a>
                        </>, <>
                            Röm.-kath. Pfarre Emmaus am Wienerberg<br/>
                            Tesarekplatz 2, 1100 Wien<br/>
                            Telefon: +43 1 616 34 00<br/>
                            IBAN: AT97 12000 50324795601<br/>
                            BIC: BKAUATWW
                        </>)}
                    </div>
                    <div>
                        <Title>Offenlegung</Title>
                        {site(<>
                              HerausgeberIn, Alleininhaber, Redaktion:<br/>
                              Röm.-kath. Pfarre Emmaus am Wienerberg,<br/>
                              Röm.-kath. Pfarre Inzersdorf,<br/>
                              Röm.-kath. Pfarre Inzersdorf-Neustift
                              <Link href={Links.Impressum}>
                                  <div className="cursor-pointer underline hover:no-underline mt-2">Impressum & Datenschutzerklärung</div>
                              </Link>
                          </>,
                          <>
                              HerausgeberIn, Alleininhaber, Redaktion:<br/>
                              Röm.-kath. Pfarre Emmaus am Wienerberg
                              <Link href={Links.Impressum}>
                                  <div className="cursor-pointer underline hover:no-underline mt-2">Impressum & Datenschutzerklärung</div>
                              </Link>
                          </>
                        )}
                    </div>
                    <div>
                        <Title>Interner Zugang</Title>
                        Wenn Sie Zugang zu den internen Systemen der {site(<>Pfarren</>, <>Pfarre</>)} brauchen, melden Sie sich in der
                        Pfarrkanzlei unter kanzlei@eni.wien.
                    </div>
                </div>
            </Responsive>
        </div>
    </>;
}

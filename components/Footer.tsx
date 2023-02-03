import Link from 'next/link';
import React, {useEffect} from 'react';
import Responsive from './Responsive';
import {useAuthenticatedUserStore, useUserStore} from '../util/use-user-store';
import {site} from '../util/sites';
import Button from "./Button";
import {useEmmausProd} from "../util/use-emmaus-prod";

export default function Footer() {
    const {user} = useAuthenticatedUserStore();
    const emmausProd = useEmmausProd();
    return <>
        <div className="pt-6 text-neutral-600 mt-6 print:hidden">
            <Responsive>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 justify-between md:items-center mb-5">
                    <div>
                        {site(
                            <>Miteinander der Pfarren Emmaus am Wienerberg,<br/>
                                Inzersdorf (St. Nikolaus),
                                Inzersdorf-Neustift
                            </>,
                            <>Röm.-kath. Pfarre Emmaus am Wienerberg</>
                        )}
                    </div>
                    <Link href="/impressum">
                        <div className="cursor-pointer underline hover:no-underline">Impressum</div>
                    </Link>
                    {user
                        ? <Link href={emmausProd ? "https://eni.wien/intern" : "/intern"}>
                            <div className="cursor-pointer underline hover:no-underline">Zum Mitgliedsbereich</div>
                        </Link>
                        : <Link href={emmausProd ? "https://eni.wien/intern" : "/intern"}>
                            <Button label="Login"/>
                        </Link>}
                </div>
            </Responsive>
        </div>
    </>;
}

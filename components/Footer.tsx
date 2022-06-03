import Link from 'next/link';
import React, {useEffect} from 'react';
import Responsive from './Responsive';
import {useUserStore} from '../util/use-user-store';
import {site, siteType, SiteType} from '../util/sites';
import Button from "./Button";

export default function Footer() {
    const [isLoggedIn, load] = useUserStore(state => [state.user?.active, state.load]);
    useEffect(() => load(), []);
    return <>
        <div className="pt-6 text-neutral-600 mt-6">
            <Responsive>
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <div className="mb-5">
                        {site(
                            <>Eine Neue Initiative. Zusammenarbeit der Pfarren:<br/>
                                <div className="text-sm mr-1 inline-block">Pfarre Emmaus am Wienerberg,</div>
                                <div className="text-sm mr-1 inline-block">Pfarre Inzersdorf (St. Nikolaus),</div>
                                <div className="text-sm mr-1 inline-block">Pfarre Inzersdorf-Neustift</div>
                            </>,
                            <>Röm.-kath. Pfarre Emmaus am Wienerberg</>
                        )}
                    </div>
                    <Link href="/impressum">
                        <div className="cursor-pointer underline hover:no-underline mb-5">Impressum</div>
                    </Link>
                    {siteType === SiteType.ENI && <>{isLoggedIn
                        ? <Link href="/intern">
                            <div className="cursor-pointer underline hover:no-underline mb-5">Zum Mitgliedsbereich</div>
                        </Link>
                        : <Link href="/login">
                            <Button label="Login"/>
                        </Link>}</>}
                </div>
            </Responsive>
        </div>
    </>;
}

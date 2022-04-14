import React from 'react';
import {site, siteType, SiteType} from '../util/sites';

export function TopBranding() {
    return <>
        <div className="py-32 mb-32 flex justify-between">
            <div>
                <div className="absolute top-0 h-full left-0 w-44 overflow-hidden">

                </div>
                <img src={site('/logo.svg', '/logo_emmaus.svg')} className="my-4"/>

                <div className="text-5xl font-bold">
                    {site('eine neue initiative', 'emmaus am wienerberg')}
                </div>
                <div className="opacity-80 leading-5 mt-4 text-lg">
                    {site(<>
                        Pfarre <span>E</span>mmaus am Wienerberg,<br/>
                        Pfarre Inzersdorf (St. <span>N</span>ikolaus) und<br/>
                        Pfarre <span>I</span>nzersdorf-Neustift<br/>
                        Dekanat XXIII, Wien
                    </>, <>
                        Röm.-kath. Pfarre Emmaus am Wienerberg<br/>
                        Dekanat XXIII, Wien
                    </>)}
                </div>
            </div>

        </div>
    </>;
}
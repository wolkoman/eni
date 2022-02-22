import React from 'react';
import {site, siteType, SiteType} from '../util/sites';

export function TopBranding() {
    return <>
        <div className="mt-24 mb-64 flex justify-between">
            <div>
                <div className="text-5xl font-bold text-white">
                    {site('eine neue initiative', 'emmaus am wienerberg')}
                </div>
                <div className="text-white opacity-80 leading-5 mt-4 text-lg">
                    {site(<>
                        Pfarre <strong>E</strong>mmaus am Wienerberg,
                        St. <strong>N</strong>ikolaus und <strong>I</strong>nzersdorf-Neustift<br/>
                        Dekanat XXIII, Wien
                    </>, <>
                        Röm.-kath. Pfarre Emmaus am Wienerberg<br/>
                        Dekanat XXIII, Wien
                    </>)}
                </div>
            </div>
            <img src={site('/logo.svg', '/logo_emmaus.svg')} className="hidden lg:block"/>
            <div className="absolute top-0 left-0 max-w-none w-full h-3xl" style={{
                backgroundImage: site('url(/hero_background.svg)', 'url(/hero_background_emmaus.svg)'),
                backgroundSize: 'cover',
                backgroundPosition: '0% 100%',
                zIndex: -100
            }}/>
        </div>
    </>;
}
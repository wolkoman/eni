import React from 'react';
import {site, siteType, SiteType} from '../util/sites';

export function TopBranding() {
    return <div className="text-6xl font-bold text-center pt-28 pb-12">
            {site('eine neue initiative', 'emmaus am wienerberg')}
        </div>;
}
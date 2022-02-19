import React from 'react';
import Articles from '../components/Articles';
import Site from '../components/Site';
import {Instagram} from '../components/Instagram';
import {Parishes} from '../components/Parishes';
import {TopBranding} from '../components/TopBranding';
import Responsive from '../components/Responsive';
import {ComingUp} from '../components/calendar/ComingUp';
import {Sections} from '../components/Sections';
import {siteType, SiteType} from '../util/sites';

export default function HomePage() {
    return <Site responsive={false}>
        {{
            [SiteType.ENI]: <>
                <Responsive>
                    <TopBranding/>
                    <Articles/>
                    <Parishes/>
                    <ComingUp/>
                </Responsive>
                <Instagram/>
                <Responsive>
                    <Sections/>
                </Responsive></>,
            [SiteType.EMMAUS]: <>
                <Responsive>
                    <TopBranding/>
                    <Articles/>
                </Responsive>
                <Instagram/>
                <Responsive>
                    <Sections/>
                </Responsive></>
        }[siteType]}
    </Site>
}


import React, {ReactNode} from 'react';
import Articles from '../components/Articles';
import Site from '../components/Site';
import {Instagram} from '../components/Instagram';
import {Parishes} from '../components/Parishes';
import {TopBranding} from '../components/TopBranding';
import Responsive from '../components/Responsive';
import {ComingUp} from '../components/calendar/ComingUp';
import {Sections} from '../components/Sections';
import {siteType, SiteType} from '../util/sites';
import Navbar from '../components/Navbar';

export default function HomePage() {
    return <Site responsive={false} navbar={false}>
        {{
            [SiteType.ENI]: <>
                <Navbar/>
                <Parishes/>
                <ComingUp/>
                <GreyBackground>
                    <Instagram/>
                </GreyBackground>
                <Responsive>
                    <Sections/>
                </Responsive></>,
            [SiteType.EMMAUS]: <>
                <Navbar/>
                <TopBranding/>
                <GreyBackground>
                    <Articles/>
                </GreyBackground>
                <ComingUp/>
                <GreyBackground>
                    <Instagram/>
                </GreyBackground>
                <Responsive>
                    <Sections/>
                </Responsive></>
        }[siteType]}
    </Site>
}

export function GreyBackground(props: { children: ReactNode }) {
    return <div className={"border-t border-b border-black/20 bg-gray-200 py-12"}>
        {props.children}
    </div>;
}

import React from 'react';
import Site from '../components/Site';
import {site} from '../util/sites';
import {Collections} from "cockpit-sdk";
import Link from "next/link";
import {fetchEmmausSites} from "../util/fetchEmmausSites";
import {GetStaticProps} from "next";

export default function HomePage(props: { sites: Collections['site'][] }) {
    return <Site responsive={true}>
        <div className="flex flex-col space-y-4 my-8">
            {props.sites.map(site => <Link href={`/${site.slug}`}><div className="text-4xl font-bold underline">{site.name}</div></Link>)}
        </div>
    </Site>
}

export const getStaticProps: GetStaticProps = async () => {
    return site({notFound: true}, {props: {sites: await fetchEmmausSites().then(site => site.filter(s => s.level === 0))}})
}
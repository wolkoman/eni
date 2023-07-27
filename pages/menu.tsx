import React from 'react';
import Site from '../components/Site';
import {site} from '../util/sites';
import {Collections} from "cockpit-sdk";
import Link from "next/link";
import {fetchEmmausSites} from "../util/fetchEmmausSites";
import {GetStaticProps} from "next";

export default function HomePage(props: { sites: Collections['site'][] }) {
    return <Site responsive={true}>
        <div className="flex flex-col my-8">
            {props.sites.map(site => <Link href={`/${site.slug}`}>
                <div className="text-2xl font-bold border-b border-black/10 py-4">{site.name}</div>
            </Link>)}
        </div>
    </Site>
}

export const getStaticProps: GetStaticProps = async () => {
    return site({notFound: true}, {
        revalidate: 10,
        props: {sites: await fetchEmmausSites().then(site => site.filter(s => s.level === 0))}
    })
}
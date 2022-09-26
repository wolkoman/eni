import TopBar from './TopBar';
import Responsive from './Responsive';
import {ReactNode} from 'react';
import Footer from './Footer';
import Head from 'next/head';
import {site} from '../util/sites';

export default function Site(props: {
    title?: string,
    description?: string,
    keywords?: string[],
    author?: string,
    children: ReactNode,
    responsive?: boolean,
    narrow?: boolean,
    navbar?: boolean,
    footer?: boolean
}) {
    return <>
        <Head>
            <title>{props.title && `${props.title} | `}{site("eni.wien", "emmaus.wien")}</title>
            {props.author && <meta name="author" content={props.author}/>}
            {props.description && <meta name="description" content={props.description}/>}
            {props.keywords && <meta name="keywords" content={props.keywords.join(", ")}/>}
        </Head>
        <div style={{minHeight: '100vh'}} className="flex flex-col justify-between">
            <div className="flex-grow flex flex-col items-stretch">
                {(props.navbar ?? true) && <TopBar/>}
                {(props.responsive ?? true) ? <Responsive narrow={props.narrow}>
                    {props.title ? <div className="font-bold text-2xl my-4">{props.title}</div> : null}
                    {props.children}
                </Responsive> : props.children}
            </div>
            {(props.footer ?? true) && <Footer/>}
        </div>
    </>;
}
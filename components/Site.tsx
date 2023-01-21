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
    showTitle?: boolean,
    navbar?: boolean,
    footer?: boolean
}) {
    return <>
        <Head>
            <title>{(props.title ? `${props.title} | ` : '')+ (site("eni.wien", "Pfarre Emmaus"))}</title>
            {props.author && <meta name="author" content={props.author}/>}
            {props.description && <meta name="description" content={props.description}/>}
            {props.keywords && <meta name="keywords" content={props.keywords.join(", ")}/>}
            <link rel="shortcut icon" type="image/png" href={(site("/favicon.png", "/favicon-emmaus.png"))}/>
        </Head>
        <div style={{minHeight: '100vh'}} className="flex flex-col justify-between">
            <div className="flex-grow flex flex-col items-stretch">
                {(props.navbar ?? true) && <>
                    <TopBar title={props.title}/>
                    {site(<></>, props.showTitle && <div className="bg-emmaus text-6xl font-bold pt-8 mb-16 px-10">
                        <div className="translate-y-6 max-w-5xl mx-auto relative">
                            {props.title}
                            <div className="absolute inset-0 text-stroke">{props.title}</div>
                        </div>
                    </div>)}
                </>}
                {(props.responsive ?? true) ? <Responsive narrow={props.narrow}>
                    {props.title ? <div className="font-bold text-2xl my-4">{site(props.title, null)}</div> : null}
                    {props.children}
                </Responsive> : props.children}
            </div>
            {(props.footer ?? true) && <Footer/>}
        </div>
    </>;
}
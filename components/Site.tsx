import TopBar from './TopBar';
import Responsive from './Responsive';
import {ReactNode, useEffect} from 'react';
import Footer from './Footer';
import Head from 'next/head';
import {site} from '../util/sites';

export default function Site(props: { title?: string, children: ReactNode, responsive?: boolean, narrow?: boolean, navbar?: boolean, footer?: boolean }) {
    return <>
        <Head>
            <title>{site("eni.wien", "tesarekplatz.at")}</title>
            <script type="text/javascript" src="https://app.mailjet.com/statics/js/widget.modal.js"/>
        </Head>
        <div style={{minHeight: '100vh'}} className="flex flex-col justify-between">
            <div>
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
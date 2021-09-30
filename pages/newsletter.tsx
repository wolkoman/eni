import React from 'react';
import Site from '../components/Site';
import Link from 'next/link';

export default function NewsletterPage() {
    return <Site title="Newsletter">
        <div>
            In unserem monatlichen Newsletter informieren wir kurz und prägnant über zukünftige, aktuelle und vergangene Geschehnisse in unseren drei Pfarren.
        </div>
        <iframe className="mj-w-res-iframe" frameBorder="0" scrolling="no"
                src="https://app.mailjet.com/widget/iframe/6LsO/KHM" width="100%" height="600px"/>
        <script type="text/javascript" src="https://app.mailjet.com/statics/js/iframeResizer.min.js"/>
    </Site>
}
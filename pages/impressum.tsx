import React from 'react';
import Site from '../components/Site';
import {cockpit} from '../util/cockpit-sdk';

export default function HomePage(props: { text: string }) {
  return <Site title="Impressum">
      <div dangerouslySetInnerHTML={{__html: props.text}}/>
  </Site>
}

export async function getStaticProps() {
  return {
    props: {
      text: (await cockpit.singletonGet('impressum')).content
    }, // will be passed to the page component as props
  }
}
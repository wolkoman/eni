import React from 'react';
import Site from '@/components/Site';
import {cockpit} from '@/util/cockpit-sdk';
import {SanitizeHTML} from '@/components/SanitizeHtml';

export default async function HomePage() {
  const text = (await cockpit.singletonGet('impressum')).content;
  return <Site title="Impressum">
      <SanitizeHTML html={text}/>
  </Site>
}

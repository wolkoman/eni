import React from 'react';
import {EventsPage} from '../components/Calendar';
import Articles from '../components/Articles';
import Site from '../components/Site';
import Button from '../components/Button';
import Link from 'next/link';
import {Instagram} from '../components/Instagram';
import {Parishes} from '../components/Parishes';
import {TopBranding} from '../components/TopBranding';
import Responsive from '../components/Responsive';
import {ComingUp} from "../components/ComingUp";

export default function EventPage() {
  return <Site>
    <EventsPage/>
  </Site>
}

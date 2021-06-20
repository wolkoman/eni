import React from 'react';
import {Calendar} from '../components/Calendar';
import {CalendarEvent, CalendarGroups, getPublicEvents} from '../util/calendar';
import {DatabaseService} from '../util/database';
import Articles from '../components/Articles';
import Site from '../components/Site';
import {Cockpit, CockpitArticles} from '../util/cockpit';
import Button from '../components/Button';

export default function HomePage(props: { calendarGroups: CalendarGroups, articles: CockpitArticles }) {
  return <Site>
      <Articles articles={props.articles}/>
      <Parishes/>
      <Calendar calendarGroups={props.calendarGroups}/>
      <div className="flex flex-col md:flex-row my-14">
        <Info title="Newsletter" image="./info-01.svg">
          In unserem monatlichen Newsletter informieren wir kurz und prägnant über zukünftige, aktuelle und vergangene
          Geschehnisse in unseren drei Pfarren.
          <data id="mj-w-res-data" data-token="8f1b2140d89962bbed083c4c06b6edd4" className="mj-w-data"
                data-apikey="6LsO" data-w-id="J4h" data-lang="de_DE" data-base="https://app.mailjet.com"
                data-width="640" data-height="328" data-statics="statics"/>
          <div className="mj-w-button mj-w-btn" data-token="8f1b2140d89962bbed083c4c06b6edd4">
            <Button label="Newsletter abonnieren"/>
          </div>
          <script type="text/javascript" src="https://app.mailjet.com/statics/js/widget.modal.js"/>
        </Info>
        <Info title="Pfarrzeitung" image="./info-02.svg">
          Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken und vieles mehr
          finden Sie in den Pfarrzeitungen der Pfarren.
          <Button label="Pfarrzeitungen ansehen"/>
        </Info>
      </div>
  </Site>
}

function Parishes() {
  return <div className="grid grid-cols-3 gap-4 md:gap-16 py-12">
    {[
      {
        image: '/emmaus.png',
        name: 'Pfarre Emmaus am Wienerberg',
        description: (x: string) => <>Die <b>{x}</b> wurde aus den Überresten der ehemaligen Wienerberger Ziegelfabrik
          errichtet.</>
      },
      {
        image: '/inzersdorf.png',
        name: 'Pfarre Inzersdorf - St. Nikolaus',
        description: (x: string) => <>Die <b>{x}</b> ist mit dem Gründungsjahr 1217 eine der ältesten Pfarren der Erzdiözese Wien.</>
      },
      {
        image: '/neustift.png',
        name: 'Pfarre Inzersdorf - Neustift',
        description: (x: string) => <>Die <b>{x}</b> entstand aus einer Teilung von der Pfarre Inzersdorf und wurde Maria, Hilfe der Christen geweiht.</>
      },
    ].map(parish => <div key={parish.name}>
      <img src={parish.image} className="pb-2" alt={parish.name}/>
      <div className="md:hidden font-bold">{parish.name}</div>
      <div className="hidden md:block">{parish.description(parish.name)}</div>
    </div>)}
  </div>;
}

const Info = ({title, image, children}: { title: string, image: string, children: any }) => {
  return <div className="px-3 text-lg">
    <div className="flex flex-row items-end mb-2">
      <img src={image} className="w-16"/>
      <div className="text-3xl ml-2 font-bold">{title}</div>
    </div>
    {children}
  </div>
}

const CalenderPeek = ({
                        calendarGroups,
                        calendar,
                        label
                      }: { calendarGroups: CalendarGroups, calendar: string, label: string }) => {
  const borderColor = ({
    'emmaus': 'border-primary1',
    'inzersdorf': 'border-primary2',
    'neustift': 'border-primary3'
  } as any)[calendar];
  const textColor = ({
    'emmaus': 'text-primary1',
    'inzersdorf': 'text-primary2',
    'neustift': 'text-primary3'
  } as any)[calendar];
  return <div className={`rounded border-l-4 ${borderColor} p-2 overflow-hidden border ${borderColor}`}>
    <div className={`${textColor} font-bold uppercase`}>Pfarre {label}</div>
    {Object.entries(calendarGroups)
      .map(([date, events]) => ([date, events.filter(event => event.calendar === calendar)] as [string, CalendarEvent[]]))
      .filter(([_, events]) => events.length > 0)
      .slice(0, 1)
      .map(([date, events]) =>
        <div key={date} className="flex flex-col py-4 px-2">
          <div className="underline mb-2"><EventDate date={new Date(date)}/></div>
          <div className="text-lg">{events.map(event =>
            <div className="">
              <div className="inline mr-2">{new Date(event.start.dateTime).toLocaleTimeString().slice(0, 5)}</div>
              <div className="inline leading-6">{event.summary}</div>
            </div>)}
          </div>
        </div>)
    }
  </div>;
};


export async function getServerSideProps() {
  let publicEvents = await getPublicEvents();
  await DatabaseService.close();
  return {
    props: {
      calendarGroups: publicEvents,
      articles: await Cockpit.article({'platform': 'eni'}, {'_o': '1'})
    }
  }
}
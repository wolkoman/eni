import Link from 'next/link';
import * as React from 'react';
import {cockpit} from '@/util/cockpit-sdk';
import {Collections} from 'cockpit-sdk';
import {Links} from "@/app/(shared)/Links";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {EniSection} from "@/app/(shared)/EniSection";
import Responsive from "../components/Responsive";
import {SectionHeader} from "../components/SectionHeader";
import Button from "../components/Button";

export function getCockpitResourceUrl(url: string) {
  if (url.startsWith('https')) return url;
  if (url.startsWith('/storage')) return `${cockpit.host}${url}`;
  if (url.startsWith('storage')) return `${cockpit.host}/${url}`;
  return `${cockpit.host}/storage/uploads/${url}`
}

export function getArticleLink(article?: Collections['article']) {
  return article ? (article.external_url || Links.Artikel(article._id)) : '';
}

function ArticleCard(props: { article?: Collections['article'] }) {
  return <Link href={getArticleLink(props.article)}>
    <div
      className={`flex flex-row cursor-pointer bg-emmaus/20 hover:bg-emmaus/5 rounded-lg p-2 gap-3`}>
      <div className="w-32 aspect-square flex-shrink-0 rounded-lg"
           style={!props.article ? {} : {
             backgroundImage: `url(${getCockpitResourceUrl(props.article.preview_image.path)})`,
             backgroundSize: 'cover',
             backgroundPosition: '50% 50%'
           }}/>
      <div className="flex flex-col justify-center overflow-hidden">
        <div className="line-clamp-3 font-semibold text-lg">{props.article?.title}</div>
      </div>
    </div>
  </Link>;
}

export default function EmmausSections(props: {
  items: Collections['article'][],
  sites: Collections['site'][],
  emmausbote: Collections['Emmausbote'][]
}) {
  const paper = props.emmausbote.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  return <div className="flex flex-col">
    <div className="py-6"><Responsive>
      <SectionHeader>Artikel</SectionHeader>
      <div className="grid md:grid-cols-3 gap-4">
        <div><ArticleCard article={props.items[0]}/></div>
        <div><ArticleCard article={props.items[1]}/></div>
        <div>
          <ArticleCard article={props.items[2]}/>
          <Link href={Links.Artikel()}>
            <div
              className="p-4 mt-4 rounded bg-emmaus/20 hover:bg-emmaus/10 font-bold text-lg cursor-pointer">Alle
              Beiträge
            </div>
          </Link>
        </div>
      </div>
    </Responsive>
    </div>

    <div className="bg-emmaus/5 py-6" id="ueber-uns"><Responsive>
      <SectionHeader>Über uns</SectionHeader>
      <div className="grid lg:grid-cols-2 gap-4">
        <EniSection
          picture="/icons/icon_weekly.svg"
          title={<>Wochen&shy;mitteilungen</>}
        >
          Gottesdienste, Veranstaltungen und Ankündigungen jede Woche neu. Sie können sich auch gerne für den Newsletter
          registrieren.

          <div className="flex justify-center gap-2 items-end grow my-2">
            {[CalendarName.EMMAUS].map(id => getCalendarInfo(id as any)).map(info =>
              <Link href={Links.Wochenmitteilungen(info.id)} key={info.id}>
                <Button label="Ansehen" className={info.className}/>
              </Link>
            )}
            <Link href="mailto:kanzlei@eni.wien?subject=Wochenmitteilungen%20Emmaus&body=Ich%20würde%20mich%20gerne%20für%20die%20Wochenmitteilungen%20von%20Emmaus%20anmelden">
              <Button label="Registrieren"/>
            </Link>
          </div>
        </EniSection>
        <EniSection
          picture={getCockpitResourceUrl(paper.preview.path)}
          title="Der Emmausbote"
        >
          Ausführliche Berichte zum Pfarrleben, Diskussionen zur Weltkirche, Impulse zum Nachdenken
          und vieles mehr finden Sie im Emmausboten.

          <div className="flex justify-center items-end grow my-2">
            <div className="flex gap-2">
              <Link href={getCockpitResourceUrl(paper.file)}>
                <Button label="Ansehen" className={getCalendarInfo(CalendarName.EMMAUS).className}/>
              </Link>
              <Link href={Links.Archiv}>
                <Button label="Archiv"/>
              </Link>
            </div>
          </div>
        </EniSection>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-12">
        {props.sites.filter(site => site.level === 0).map(site =>
          <Link
            href={"/seite/" + site.slug}
            className="p-4 py-6 rounded border border-emmaus/20 hover:bg-emmaus/5 font-bold text-lg cursor-pointer grid place-items-center text-center"
          >
            {site.name}
          </Link>
        )}
      </div>
    </Responsive></div>
  </div>;
}

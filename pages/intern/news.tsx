import React, {useEffect} from 'react';
import {usePermission} from '../../util/use-permission';
import Site from '../../components/Site';
import Button from '../../components/Button';
import {Permission} from '../../util/verify';
import {TemplateHandler} from 'easy-template-x';
import {CalendarEvent} from '../../util/calendar-events';
import sanitize from 'sanitize-html';
import {useState} from '../../util/use-state-util';
import {sanitizeOptions} from '../../components/SanitizeHtml';
import {getWeekDayName} from '../../components/calendar/Calendar';
import {useCalendarStore} from '../../util/use-calendar-store';
import {calendar} from "googleapis/build/src/apis/calendar";


export default function InternArticles() {
  usePermission([Permission.Admin]);
  const [data, , setPartialData] = useState({start: new Date(), end: new Date()});
  const [calendar, events, loaded, load] = useCalendarStore(state => [state,state.items, state.loaded, state.load])

  useEffect(() => load(), [])

  function pad(num: number){
    return `${num < 10 ? '0' : ''}${num}`
  }
  function toTime(dateTime: string){
    const date = new Date(dateTime);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  function toCalEevent(event: CalendarEvent) {
    return {
      time: toTime(event.start.dateTime),
      title: event.summary + (event.mainPerson ? ` / ${event.mainPerson}` : ""),
      description:  event.description.toString().trim().length > 0 ? `\n${sanitize(event.description.trim(), sanitizeOptions)}` : ""
    };
  }

  async function generate() {
    const response = await fetch('/eni.docx');
    const templateFile = await response.blob();
    const wordData = {
      event: Object.entries(calendar.groupByDate(events))
        .filter(([date]) => data.start.getTime() <= new Date(date).getTime() && data.end.getTime() >= new Date(date).getTime())
        .map(([date, events]) => ({date, events: events.filter(e => e.visibility === "public")}))
        .map(({date, events}) => {
          const day = new Date(date).getDay();
          return ({
            sundaydate: day === 0 ? `${getWeekDayName(day)}, ${date.split('-').reverse().join('.').substring(0, 5)}` : '',
            date: day !== 0 ? `${getWeekDayName(day)}, ${date.split('-').reverse().join('.').substring(0, 5)}` : '',
            emmaus: events.filter(event => event.calendar === 'emmaus').map(toCalEevent),
            inzersdorf: events.filter(event => event.calendar === 'inzersdorf').map(toCalEevent),
            neustift: events.filter(event => event.calendar === 'neustift').map(toCalEevent),
          });
        }),
    };

    const handler = new TemplateHandler();
    const doc = await handler.process(templateFile, wordData as any);

    saveFile('wochenmitteilung.docx', doc);

    function saveFile(filename: string, blob: Blob) {
      const blobUrl = URL.createObjectURL(blob);
      let link: HTMLAnchorElement | null = document.createElement("a");
      link.download = filename;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      link?.remove();
      window.URL.revokeObjectURL(blobUrl);
      link = null;
    }
  }

  return <Site title="Wochenmitteilungen">
    <div>
      <div className="mt-4 text-sm">Start</div>
      <input type="date" className="bg-gray-200 px-3 py-1" onChange={(e) => setPartialData({start: new Date(e.target.value)})}/>
    </div>
    <div>
      <div className="mt-4 text-sm">Ende</div>
      <input type="date" className="bg-gray-200 px-3 py-1" onChange={(e) => setPartialData({end: new Date(e.target.value)})}/>
    </div>
    <Button className="mt-4" label="Generieren" onClick={() => generate()} disabled={!loaded}/>
  </Site>;
}

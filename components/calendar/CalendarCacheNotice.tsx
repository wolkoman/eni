import React from 'react';
import {useCalendarStore} from '../../util/use-calendar-store';

export function CalendarCacheNotice({}) {
  const cached = useCalendarStore(state => state.cache);
  return cached ? <div className="flex items-center  mb-5 p-3 border-2 border-[#f00]">
    <div className="bg-gray-800 rounded-3xl w-5 h-5 text-center text-white text-xl font-bold leading-6 mr-2">
      <div>i</div>
    </div>
    <div className="italic">Aufgrund eines Systemfehlers werden derzeit nur Termine aus Emmaus angezeigt. Das Problem wird in der Nacht von Donnerstag auf Freitag behoben. Bitte entschuldigen Sie den Fehler!</div>
  </div> : <></>;
}

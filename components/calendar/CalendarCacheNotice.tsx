import React from 'react';
import {useCalendarStore} from '../../util/store';

export function CalendarCacheNotice({}) {
  const cached = useCalendarStore(state => state.cache);
  return cached ? <div className="flex items-center  mb-5">
    <div className="bg-gray-800 rounded-3xl w-5 h-5 text-center text-white text-xl font-bold leading-6 mr-2">
      <div>i</div>
    </div>
    <div className="italic">Diese Termine wurden zuletzt aktualisiert am {new Date(cached).toLocaleDateString()} um {new Date(cached).toLocaleTimeString()}.</div>
  </div> : <></>;
}
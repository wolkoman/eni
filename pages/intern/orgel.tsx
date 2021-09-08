import React, {useEffect, useState} from 'react';
import Site from '../../components/Site';
import {useUserStore} from '../../util/store';
import {CalendarEvent} from '../../util/calendarEvents';

export default function Orgel() {
  const user = useUserStore(state => state.user)
  const [data, setData] = useState<{date: string, hours: string[], myBookings: CalendarEvent[]}>({date: "", hours: [], myBookings: []});
  useEffect(() => {
    if(user)
    fetch(`/api/organ-booking/my?token=${user?.api_key}&userId=${user?._id}`).then(x => x.json()).then(myBookings => setData(data => ({...data, myBookings })));
  }, [user]);
  return <Site title="Orgel">
    {data.myBookings.length === 0 || <div className="mb-8">
      <div className="text-lg underline">Meine Buchungen</div>
      <div>
        {data.myBookings.map(booking => <div className="flex">
          <div className="w-24">{new Date(booking.start.dateTime).toLocaleDateString()}</div>
          <div>{new Date(booking.start.dateTime).toLocaleTimeString()} - {new Date(booking.end.dateTime).toLocaleTimeString()}</div>
        </div>)}
      </div>
    </div>}
    <div>
      <div className="text-lg underline">Buchung erstellen</div>
      <input type="date" onChange={(event) => {
        setData(data => ({...data, date: event.target.value, hours: []}));
        fetch(`/api/organ-booking/check?token=${user?.api_key}&date=${event.target.value}`).then(x => x.json()).then(hours => setData(data => ({...data, hours})));
      }}/>
      <div className="my-2 flex flex-wrap">
      {data.hours.map(hour => <div className="px-4 py-2 mr-2 mb-2 bg-gray-200 hover:bg-primary1 hover:text-white cursor-pointer" key={hour} onClick={() => {
        fetch(`/api/organ-booking/book?token=${user?.api_key}&dateTime=${new Date(`${data.date} ${hour}`).toUTCString()}&userId=${user?._id}`);
      }}>{hour}</div>)}
      </div>
    </div>
  </Site>
}

import React, {useEffect} from 'react';
import Site from '../../components/Site';
import {useUserStore} from '../../util/store';
import {CalendarEvent} from '../../util/calendar-events';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import {toast} from 'react-toastify';
import {fetchJson} from '../../util/fetch-util';
import {useState} from '../../util/use-state-util';

export default function Orgel() {
  const user = useUserStore(state => state.user)
  const [data, setData, setPartialData] = useState<{ date: string, slots: string[], availableSlots: string[], myBookings: CalendarEvent[], loading: boolean }>({
    date: '',
    slots: [],
    availableSlots: [],
    myBookings: [],
    loading: false
  });


  useEffect(() => {
    if (user)
      loadMyBooking();
  }, [user]);

  function loadMyBooking() {
    fetchJson(`/api/organ-booking/my?token=${user?.api_key}&userId=${user?._id}`)
      .then(myBookings => setPartialData({myBookings}));
  }

  function loadAvailableHours(value: string) {
    setPartialData({date: value, slots: []});
    fetchJson(`/api/organ-booking/check?token=${user?.api_key}&date=${value}`)
      .then(data => setPartialData({slots: data.slots, availableSlots: data.availableSlots}));
  }

  function bookHour(hour: string) {
    setPartialData(data => ({availableSlots: data.availableSlots.filter(h => h !== hour)}))
    fetchJson(`/api/organ-booking/book?token=${user?.api_key}&date=${data.date}&hour=${hour}&userId=${user?._id}`, {},
      {pending: 'Buche Orgel...', success: 'Buchung erfolgreich', error: 'Buchung war nicht erfolgreich'})
      .then((booking) => setPartialData(data => ({
        availableSlots: data.availableSlots.filter(h => h !== hour),
        myBookings: [...data.myBookings, booking]
      })))
      .catch(() => setPartialData(data => ({availableSlots: [...data.availableSlots, hour]})));
  }

  function setMyBookingStatus(booking: CalendarEvent, enabled: boolean) {
    setPartialData({
      myBookings: data.myBookings.map(b => ({
        ...b,
        description: b.id === booking.id ? (enabled ? '' : 'NO') : b.description
      }))
    });
  }

  function unbookHour(booking: CalendarEvent) {
    setMyBookingStatus(booking, false);
    fetchJson(`/api/organ-booking/delete?token=${user?.api_key}&id=${booking.id}`, {},
      {pending: 'Lösche Buchung', success: 'Buchung gelöscht', error: 'Fehler ist aufgetreten'})
      .then(() => {
        setPartialData({myBookings: data.myBookings.filter(b => b.id !== booking.id)});
        if(data.date === booking.start.dateTime.substring(0, 10)){
          setPartialData(data => ({availableSlots: [...data.availableSlots, booking.start.dateTime.substring(11,16)]}));
        }
      })
      .catch(() => setMyBookingStatus(booking, true));
  }

  return <Site title="Orgel">

    <div className="flex flex-col md:flex-row">

      <div className="mb-8 md:w-72 md:border-r md:pr-4">
        <div className="text-lg mb-3">Meine Buchungen</div>
        <div>
          {data.myBookings.map(booking => <div
            className={`flex bg-gray-200 mb-2 px-3 py-2 justify-between ${booking.description === 'NO' ? 'pointer-events-none opacity-50' : ''}`}>
            <div className="flex">
              <div className="w-20 font-bold">
                {new Date(booking.start.dateTime).toLocaleDateString()}
              </div>
              <div>
                {new Date(booking.start.dateTime).toLocaleTimeString().substring(0, 5)}{' - '}
                {new Date(booking.end.dateTime).toLocaleTimeString().substring(0, 5)} Uhr
              </div>
            </div>
            <div className="on-parent-hovers cursor-pointer relative w-2 hover:opacity-80" onClick={() => {
              unbookHour(booking);
            }}>
              <div className="absolute top-3 left-0 w-3 h-0.5 bg-black transform rotate-45"/>
              <div className="absolute top-3 left-0 w-3 h-0.5 bg-black transform -rotate-45"/>
            </div>
          </div>)}
        </div>
      </div>

      <div className="md:pl-4">
        <div className="text-lg">Buchung erstellen</div>
        <div className="mt-3 mb-1 text-sm">Datum</div>
        <input type="date" className="bg-gray-200 px-3 py-1" onChange={(e) => loadAvailableHours(e.target.value)}/>
        <div className="mt-3 mb-1 text-sm">Verfügbare Zeitslots</div>
        <div className="mb-2 flex flex-wrap">
          {
            data.slots.map(hour => {
              const unavailable = !data.availableSlots.includes(hour);
              return <div
                key={hour}
                className={`px-3 py-1 mr-2 mb-2 ${unavailable ? 'bg-red-800 text-white' : 'cursor-pointer hover:bg-primary1 hover:text-white bg-gray-200'}`}
                onClick={() => unavailable ? null : bookHour(hour)}>{hour}</div>;
            })
          }
        </div>
      </div>

    </div>
  </Site>
}

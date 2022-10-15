import React, {useEffect} from 'react';
import Site from '../../components/Site';
import {toast} from 'react-toastify';
import {fetchJson} from '../../util/fetch-util';
import {useState} from '../../util/use-state-util';
import {useUserStore} from '../../util/use-user-store';
import {CalendarEvent} from "../../util/calendar-types";

export default function Orgel() {
  const jwt = useUserStore(state => state.jwt)
  const [data, , setPartialData] = useState<{ date: string, slots: string[], availableSlots: string[], myBookings: CalendarEvent[], slotsLoading: boolean, bookingLoading: boolean
  }>({
    date: '',
    slots: [],
    availableSlots: [],
    myBookings: [],
    slotsLoading: false,
    bookingLoading: false,
  });

  useEffect(() => {

    function loadMyBooking() {
      setPartialData({bookingLoading: true});
      fetchJson(`/api/organ-booking/my`, {jwt})
          .then(myBookings => setPartialData({myBookings}))
          .catch(() => toast(`Buchungen konnten nicht geladen werden`, {type: 'error'}))
          .finally(() => setPartialData({bookingLoading: false}));
    }

    if (jwt)
      loadMyBooking();
  }, [jwt]);


  function loadAvailableHours(value: string) {
    setPartialData({date: value, slots: [], slotsLoading: true});
    fetchJson(`/api/organ-booking/check?date=${value}`, {jwt})
      .then(data => setPartialData({slots: data.slots, availableSlots: data.availableSlots, slotsLoading: false}));
  }

  function bookHour(hour: string) {
    setPartialData(data => ({availableSlots: data.availableSlots.filter(h => h !== hour)}))
    //toast.promise(new Promise((res,rej) => setTimeout(rej, 1000)), {error: 'error', success: '', pending: 'p'});
    //return;
    fetchJson(`/api/organ-booking/book?slot=${hour}`, {jwt},
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
    fetchJson(`/api/organ-booking/delete?id=${booking.id}`, {jwt},
      {pending: 'Lösche Buchung', success: 'Buchung gelöscht', error: 'Fehler ist aufgetreten'})
      .then(() => {
        const myBookings = data.myBookings.filter(b => b.id !== booking.id);
        if(data.date === booking.start.dateTime.substring(0, 10)){
          setPartialData(data => ({myBookings, availableSlots: [...data.availableSlots, new Date(booking.start.dateTime).toISOString()]}));
        }else{
          setPartialData({myBookings});
        }
      })
      .catch(() => setMyBookingStatus(booking, true));
  }

  return <Site title="Orgel">

    <div className="flex flex-col md:flex-row">

      <div className="mb-8 md:w-72 md:border-r md:pr-4 flex-shrink-0">
        <div className="text-lg mb-3">Meine Buchungen</div>
        <div>
          {
            !data.bookingLoading && data.myBookings.length === 0 && <div className="opacity-70 text-sm italic">Es sind keine zukünftigen Buchungen vorhanden.</div>
          }
          {
            data.bookingLoading && Array(3).fill(0).map((_, index) => <div key={index} className={`h-9 mb-1 shimmer`}/>)
          }
          {data.myBookings.map(booking => <div
            key={booking.id}
            className={`flex bg-gray-200 mb-2 px-3 py-2 justify-between ${booking.description === 'NO' ? 'pointer-events-none opacity-50' : ''}`}>
            <div className="flex">
              <div className="w-20 font-bold">
                {new Date(booking.start.dateTime).toLocaleDateString("de-AT")}
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
            data.slotsLoading && Array(10).fill(0).map((_, index) => <div key={index} className={`w-24 h-14 mr-2 mb-2 shimmer`}/>)
          }
          {
            data.slots.map(slot => {
              const unavailable = !data.availableSlots.includes(slot);
              return <div
                key={slot}
                className={`w-24 h-14 text-center mr-2 mb-2 flex justify-center items-center ${unavailable ? 'cursor-default opacity-50' : 'cursor-pointer hover:bg-emmaus hover:text-white bg-gray-200'}`}
                onClick={() => unavailable ? null : bookHour(slot)}>
                <div>{new Date(slot).toLocaleTimeString().substring(0,5)}</div>
              </div>;
            })
          }
        </div>
      </div>

    </div>
  </Site>
}

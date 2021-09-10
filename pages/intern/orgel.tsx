import React, {useEffect, useState} from 'react';
import Site from '../../components/Site';
import {useUserStore} from '../../util/store';
import {CalendarEvent} from '../../util/calendarEvents';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

export default function Orgel() {
  const user = useUserStore(state => state.user)
  const [modal, setModal] = useState({active: false, date: '', hour: '', loading: false, error: false});
  const [data, setData] = useState<{ date: string, hours: string[], myBookings: CalendarEvent[] }>({
    date: '',
    hours: [],
    myBookings: []
  });
  useEffect(() => {
    if (user && !modal.active)
      fetch(`/api/organ-booking/my?token=${user?.api_key}&userId=${user?._id}`).then(x => x.json()).then(myBookings => setData(data => ({
        ...data,
        myBookings
      })));
  }, [user, modal.active]);

  return <Site title="Orgel">

    {modal.active && <Modal
      title="Orgel Buchung"
      button=
        {!modal.error ?
          <div className="flex">
            <Button
              label="Abbrechen"
              secondary={true}
              onClick={() => setModal(x => ({...x, active: false}))}
              className="mr-2"
            />
            <Button label="Bestätigen" onClick={() => {
              setModal(x => ({...x, loading: true}));
              fetch(`/api/organ-booking/book?token=${user?.api_key}&date=${modal.date}&hour=${modal.hour}&userId=${user?._id}`)
                .then((response) => setModal(x => (response.ok ? {...x, active: false} : {...x, error: true})));
            }}/>
          </div> :
          <Button
            label="Okay"
            onClick={() => setModal(x => ({...x, active: false}))}
          />}
      content={!modal.error
        ? <>Wollen Sie die Orgel am {modal.date} um {modal.hour} Uhr buchen ?</>
        : <>Die Orgel kann zu dieser Zeit nicht gebucht werden.</>
      }
    />}

    <div className="flex flex-col md:flex-row">

      <div className="mb-8 md:w-72 md:border-r md:pr-4">
        <div className="text-lg mb-3">Meine Buchungen</div>
        <div>
          {data.myBookings.map(booking => <div
            className={`flex bg-gray-200 mb-2 px-2 py-1 justify-between ${booking.description === 'NO' ? 'pointer-events-none opacity-50' : ''}`}>
            <div className="flex">
              <div className="w-20 font-bold">
                {new Date(booking.start.dateTime).toLocaleDateString()}
              </div>
              <div>
                {new Date(booking.start.dateTime).toLocaleTimeString().substring(0, 5)}{' - '}
                {new Date(booking.end.dateTime).toLocaleTimeString().substring(0, 5)} Uhr
              </div>
            </div>
            <div className="on-parent-hover cursor-pointer" onClick={() => {
              setData(data => ({
                ...data,
                myBookings: data.myBookings.map(b => ({...b, description: b.id === booking.id ? 'NO' : b.description}))
              }))
              fetch(`/api/organ-booking/delete?token=${user?.api_key}&id=${booking.id}`).then(response => {
                if (response.ok) {
                  setData(data => ({
                    ...data,
                    myBookings: data.myBookings.filter(b => b.id !== booking.id)
                  }))
                }
              });
            }}>
              X
            </div>
          </div>)}
        </div>
      </div>

      <div className="md:pl-4">
        <div className="text-lg">Buchung erstellen</div>
        <div className="mt-3 mb-1 text-sm">Datum</div>
        <input type="date" className="bg-gray-200 px-3 py-1" onChange={(event) => {
          setData(data => ({...data, date: event.target.value, hours: []}));
          fetch(`/api/organ-booking/check?token=${user?.api_key}&date=${event.target.value}`)
            .then(x => x.json())
            .then(hours => setData(data => ({...data, hours})));
        }}/>
        <div className="mt-3 mb-1 text-sm">Verfügbare Zeitslots</div>
        <div className="mb-2 flex flex-wrap">
          {data.hours.map(hour => <div
            key={hour}
            className="px-3 py-1 mr-2 mb-2 bg-gray-200 hover:bg-primary1 hover:text-white cursor-pointer"
            onClick={() => setModal({active: true, date: data.date, hour, loading: false, error: false})}>{hour}</div>)}
        </div>
      </div>

    </div>

  </Site>
}

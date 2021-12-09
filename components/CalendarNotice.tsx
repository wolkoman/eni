import React from 'react';

export function PrivateCalendarNotice() {
  return <div className="px-3 py-1 text-sm pb-4 text-gray-500 md:w-44">
    <div className="font-bold">Private Kalenderansicht</div>
    Geben Sie vertrauliche Daten nicht weiter!
  </div>;
}

export function CalendarErrorNotice() {
  return <div className="bg-gray-100 p-4 px-8 rounded" data-testid="calendar-error">
    Beim Laden der Termine ist ein Fehler aufgetreten. <br/>
    Für Informationen zu den Terminen kontaktieren Sie die Kanzlei.
  </div>;
}
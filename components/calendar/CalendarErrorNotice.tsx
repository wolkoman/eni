import React from 'react';

export function CalendarErrorNotice() {
    return <div className="bg-gray-100 p-4 px-8 rounded" data-testid="calendar-error">
        Beim Laden der Termine ist ein Fehler aufgetreten. <br/>
        Laden Sie die Seite bitte neu!
    </div>;
}
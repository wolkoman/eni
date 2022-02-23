import React from 'react';

export function CalendarErrorNotice() {
    return <div className="bg-white p-4 px-8 rounded border-2 border-red-500" data-testid="calendar-error">
        Beim Laden der Termine ist ein Fehler aufgetreten. <br/>
        Laden Sie die Seite bitte neu!
    </div>;
}
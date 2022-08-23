import React from 'react';
import {useCalendarStore} from "../../util/use-calendar-store";

export function CalendarErrorNotice() {

    const isLoading = useCalendarStore(state => state.loading)

    return <div className={`bg-white p-4 px-8 rounded-2xl border-4 ${isLoading ? 'border-red-600' : 'border-black/20'}`} data-testid="calendar-error">
        <div className="text-lg font-bold">Eine Sekunde noch..</div>
        Es gibt Probleme beim Abrufen der Termine. <br/>
        Wir versuchen es nochmals!

    </div>;
}
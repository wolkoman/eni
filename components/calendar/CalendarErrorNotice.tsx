import React from 'react';
import {useCalendarStore} from "../../util/use-calendar-store";

export function CalendarErrorNotice() {

    const isLoading = useCalendarStore(state => state.loading)

    return <div className={`bg-black/5 p-4 px-8 rounded-2xl border-4 flex gap-8 items-center`} data-testid="calendar-error">
        <img src="/KalenderFehler.svg" className="h-28 animate-pulse"/>
        <div>
            <div className="text-lg font-bold">Eine Sekunde noch..</div>
            <div>Es gibt Probleme beim Abrufen der Termine. <br/>
                Bitte warten Sie noch kurz!</div>
        </div>

    </div>;
}
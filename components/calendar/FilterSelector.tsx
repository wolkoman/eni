import {Permission, Permissions} from '../../util/verify';
import {Calendar} from '../../util/calendar-events';
import {getCalendarInfo} from '../../util/calendar-info';
import {FilterType, Person} from './Calendar';

export function FilterSelector(props: { filter: FilterType, setFilter: (filter: FilterType) => void, userPermissions: Permissions }) {
    const parishFilters: { label: string, parish: Calendar }[] = [
        {label: 'Emmaus', parish: 'emmaus'},
        {label: 'St. Nikolaus', parish: 'inzersdorf'},
        {label: 'Neustift', parish: 'neustift'},
    ];
    const personFilters: { label: string, person: Person }[] = [
        {label: 'Zvonko', person: 'brezovski'},
        {label: 'David', person: 'campos'},
        {label: 'Gil', person: 'thomas'},
        {label: 'Marcin', person: 'wojciech'},
    ];
    return <>
        <div
            className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
            data-testid="parish-selector">
            <div
                className={`px-3 py-1 mb-1 cursor-pointer rounded ${props.filter === null ? 'bg-gray-200' : ''}`}
                onClick={() => props.setFilter(null)}
            >
                Alle
            </div>
            {parishFilters.map(filt => <div
                    key={filt.label}
                    className={`px-3 py-1 mb-1 cursor-pointer rounded ${props.filter?.filterType === 'PARISH' && props.filter.parish === filt.parish ? getCalendarInfo(filt.parish).className : ''}`}
                    onClick={() => props.setFilter({filterType: 'PARISH', parish: filt.parish})}>
                    {filt.label}
                </div>
            )}
        </div>
        {props.userPermissions[Permission.PrivateCalendarAccess] && <div
          className="flex md:flex-col flex-row justify-around md:justify-start flex-shrink-0"
          data-testid="parish-selector">
            {personFilters.map(filt => <div
                    key={filt.label}
                    className={`px-3 py-1 mb-1 cursor-pointer rounded ${props.filter?.filterType === 'PERSON' && props.filter.person === filt.person ? 'bg-gray-200' : ''}`}
                    onClick={() => props.setFilter({filterType: 'PERSON', person: filt.person})}>
                    {filt.label}
                </div>
            )}
        </div>}
    </>;
}
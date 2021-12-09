import {useState} from '../util/use-state-util';
import React, {useEffect} from 'react';
import {getMonthName} from './Calendar';

function CalendarOverview(props: { date: string }) {
  const [data, , setPartialData] = useState({day: 0, month: 0, year: 2020, firstDay: 0, daysInMonth: 0});
  const changeMonth = (month: number) => {
    const date = new Date(data.year, data.month + month, data.day);
    setPartialData({year: date.getFullYear(), month: date.getMonth()});
  };

  useEffect(() => {
    setPartialData({
      firstDay: new Date(data.year, data.month, 1).getDay(),
      daysInMonth: new Date(data.year, data.month + 1, 0).getDate(),
    });
  }, [data.month, data.year]);

  useEffect(() => {
    if (props.date === '' || props.date === undefined) return;
    const date = new Date(props.date);
    setPartialData({day: date.getDate(), month: date.getMonth(), year: date.getFullYear()});
  }, [props.date]);

  return <>
    <div className="flex">
      <div onClick={() => changeMonth(-1)}>{'<'}</div>
      <div className="text-center flex-grow">{getMonthName(data.month)} {data.year}</div>
      <div onClick={() => changeMonth(1)}>{'>'}</div>
    </div>
    <div className="grid grid-cols-7">
      {Array(((data.firstDay) + 6) % 7).fill(null).map((_, i) => <div key={i}/>)}
      {Array(data.daysInMonth).fill(null).map((_, i) => {
        return <div key={i}
                    className={`text-sm text-center rounded-lg ${i + 1 === data.day ? 'bg-primary1 text-white' : ''}`}>{(i + 1)}</div>;
      })}
    </div>
  </>;
}
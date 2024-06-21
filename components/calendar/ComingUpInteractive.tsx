"use client"

import React, {useMemo, useState} from 'react';
import {ListView} from "./ListView";
import {SectionHeader} from "../SectionHeader";
import {site} from "@/app/(shared)/Instance";
import {groupEventsByGroupAndDate} from "@/domain/events/CalendarGrouper";
import {motion} from 'framer-motion';
import {EventsObject} from "@/domain/events/EventMapper";

export function ComingUpInteractive(props: {
  eventsObject: EventsObject
}) {
  const groups = useMemo(() => groupEventsByGroupAndDate(props.eventsObject.events, true), [props.eventsObject, false]);
  const urlPrefix = site('', 'https://eni.wien');
  const [page, setPage] = useState(0)
  const [group, eventsObject] = useMemo(() => groups[page], [groups, page])

  return <>
    <SectionHeader id="coming-up">Termine und Angebote</SectionHeader>
    <motion.div className="flex flex-col lg:flex-row gap-8 relative rounded-lg bg-white shadow border border-black/10 min-h-[400px]">
      <div className="p-2 lg:py-8 lg:px-6 z-10 relative border-b lg:border-r border-black/10 flex lg:flex-col whitespace-pre overflow-auto lg:w-60">
        {groups.map(([group], index) => <motion.div
            key={group}
            className={`px-4 py-1  z-20 relative transition ${index == page ? "font-semibold" : "opacity-80 cursor-pointer"}`}
            onClick={() => setPage(index)}
          >
            {group}
            {index === page ? <motion.div className="absolute inset-0 bg-black/5 rounded" layoutId="highlight" transition={{velocity: 100}}/> : ""}
          </motion.div>
        )}
      </div>
      <motion.div
        key={group}
        data-link={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}
        className={`px-8 lg:py-8 lg:px-6`}
      >
        <div className="text-xl font-semibold mb-4 mt-2">{group}</div>
        <div>
          <ListView search="" editable={false} items={Object.values(eventsObject).flat()} liturgy={{}}
                    filter={null}/>
        </div>
      </motion.div>
    </motion.div>
  </>;
}

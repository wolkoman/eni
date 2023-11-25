"use client"

import React, {useRef, useState} from 'react';
import Responsive from '../Responsive';
import {Preference, usePreferenceStore} from "@/store/PreferenceStore";
import {ListView} from "./ListView";
import {SectionHeader} from "../SectionHeader";
import {CalendarEvent, EventsObject} from "@/domain/events/EventMapper";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {getGroupSorting} from "@/domain/events/CalendarGroupSorter";
import {site} from "@/app/(shared)/Instance";
import {groupEventsByDate, groupEventsByGroup} from "@/domain/events/CalendarGrouper";
import {motion, PanInfo, useMotionValue} from 'framer-motion';

export function ComingUp(props: { eventsObject: EventsObject }) {
    const [separateMass] = usePreferenceStore(Preference.SeparateMass);
    const groups = Object.entries(groupEventsByGroup(props.eventsObject.events, separateMass))
        .sort(([group1], [group2]) => getGroupSorting(group2 as CalendarGroup) - getGroupSorting(group1 as CalendarGroup))
        .map(([group, events]) => [group,
            groupEventsByDate([CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
                .flatMap(calendar => events
                    .filter(event => event.calendar === calendar)
                    .slice(0, site(1, 3))
                )
                .sort((b, a) => b.start.dateTime?.localeCompare(a.start.dateTime))
            )]) as [string, Record<string, CalendarEvent[]>][]
    const urlPrefix = site('','https://eni.wien');

    const [page, setPage] = useState(0)
    const ref = useRef<HTMLDivElement>(null)

    function onDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo){
        const step = -Math.sign(info.velocity.x)
        const newPage = Math.min( Math.max(page + step, 0), groups.length - 1)
        setPage(newPage)
    }

    return <Responsive>
        <div className="my-8">
            <SectionHeader id="coming-up">Termine und Angebote</SectionHeader>
            <div className={`flex gap-8 py-4 lg:overflow-hidden relative`}>
                <div className="bg-white rounded-lg p-4 px-6 w-60 z-10 relative lg:overflow-hidden shrink-0 hidden lg:block">
                    <div className="bg-black/5 z-10 absolute inset-0"/>
                    {groups.map(([group], index) =>
                      <motion.div
                        key={group}
                        className={`p-1 cursor-pointer z-20 relative`}
                        onClick={() => setPage(index)}
                        animate={{fontWeight: index === page ? 800 : 400 }}
                      >
                          {group}
                      </motion.div>
                    )}
                </div>
                <div className="hidden lg:block absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"/>
                <motion.div
                  ref={ref}
                  className="flex cursor-grab"
                  drag="x"
                  onDragEnd={onDragEnd}
                  dragConstraints={{right: 0, left: (groups.length-1) * -500}}
                  animate={{x: page * -500}}
                  transition={{type: "keyframes", ease: "easeInOut" }}
                >
                {groups.map(([group, eventsObject], index) => {
                    const clickToJump = Math.abs(index - page) === 1
                      return <motion.div
                        key={group}
                        data-link={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}
                        className={`py-4 px-7 rounded-xl border border-black/20 w-52 lg:w-[500px] shrink-0 ${clickToJump && "cursor-pointer"}`}
                        onClick={clickToJump ? () => setPage(index) : undefined}
                        animate={[
                            {opacity: 0.5, scale: 0.95},
                            {opacity: 1},
                            {opacity: 0.5, scale: 0.95},
                        ][Math.sign(index - page) + 1]}
                      >
                          <div className="flex gap-2 mb-4 mt-2">
                              <div className="text-3xl font-semibold">{group}</div>
                          </div>
                          <div>
                              <ListView search="" editable={false} items={Object.values(eventsObject).flat()} liturgy={{}}
                                        filter={null}/>
                          </div>
                      </motion.div>;
                  }
                )}
                </motion.div>
            </div>
        </div>
    </Responsive>;
}

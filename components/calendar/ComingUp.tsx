"use client"

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Preference, usePreferenceStore} from "@/store/PreferenceStore";
import {ListView} from "./ListView";
import {SectionHeader} from "../SectionHeader";
import {EventsObject} from "@/domain/events/EventMapper";
import {site} from "@/app/(shared)/Instance";
import {groupEventsByGroupAndDate} from "@/domain/events/CalendarGrouper";
import {motion, PanInfo} from 'framer-motion';

export function ComingUp(props: { eventsObject: EventsObject }) {
  const [separateMass] = usePreferenceStore(Preference.SeparateMass);
  const groups = useMemo(() => groupEventsByGroupAndDate(props, separateMass), [props, separateMass]);
  const urlPrefix = site('', 'https://eni.wien');

  const [page, setPage] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const offsetLeft = useMemo(() => {
    console.log("calc", page, ref, -(ref.current?.children[page] as HTMLDivElement)?.offsetLeft)
    return -(ref.current?.children[page] as HTMLDivElement)?.offsetLeft;
  }, [page, ref]);
  useEffect(() => {
    setPage(0)
  } ,[ref])

  return <div className="my-8">
    {offsetLeft}
    <SectionHeader id="coming-up">Termine und Angebote</SectionHeader>
    <div className={`flex gap-8  overflow-hidden relative -mx-4 px-4 lg:m-0 lg:p-0 py-4`}>
      <div className="bg-white rounded-lg p-4 px-6 w-60 z-10 relative overflow-hidden shrink-0 hidden lg:block">
        <div className="bg-black/5 z-10 absolute inset-0"/>
        {groups.map(([group], index) => <motion.div
            key={group}
            className={`p-1 cursor-pointer z-20 relative`}
            onClick={() => setPage(index)}
            animate={{fontWeight: index === page ? 800 : 400}}
            children={group}
          />
        )}
      </div>
      <div
        className="hidden lg:block absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"/>
      <motion.div
        ref={ref}
        className="flex cursor-grab"
        drag="x"
        onDragEnd={(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
          const step = -Math.sign(info.velocity.x)
          setPage(Math.min(Math.max(page + step, 0), groups.length - 1))
        }}
        dragConstraints={{
          right: 0,
          left: -(ref.current?.children[ref.current?.children.length - 1] as HTMLDivElement)?.offsetLeft
        }}
        initial={false}
        animate={{x: offsetLeft}}
        transition={{type: "keyframes", ease: "easeInOut"}}
      >
        {groups.map(([group, eventsObject], index) => {
            const clickToJump = Math.abs(index - page) === 1
            return <motion.div
              key={group}
              data-link={`${urlPrefix}/termine?q=${encodeURIComponent(group)}`}
              className={`py-4 px-7 rounded-xl border border-black/20 w-[calc(100vw-50px)] lg:w-[500px] shrink-0 ${clickToJump && "cursor-pointer"}`}
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
  </div>;
}

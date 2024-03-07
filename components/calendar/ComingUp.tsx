"use client"

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Preference, usePreferenceStore} from "@/store/PreferenceStore";
import {ListView} from "./ListView";
import {SectionHeader} from "../SectionHeader";
import {EventsObject} from "@/domain/events/EventMapper";
import {site} from "@/app/(shared)/Instance";
import {groupEventsByGroupAndDate} from "@/domain/events/CalendarGrouper";
import {motion, PanInfo, useMotionValue} from 'framer-motion';

export function ComingUp(props: { eventsObject: EventsObject }) {
  const [separateMass] = usePreferenceStore(Preference.SeparateMass);
  const groups = useMemo(() => groupEventsByGroupAndDate(props.eventsObject.events, separateMass), [props, separateMass]);
  const urlPrefix = site('', 'https://eni.wien');

  const [page, setPage] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)
  useEffect(() => {
    setOffsetLeft(-(ref.current?.children[page] as HTMLDivElement)?.offsetLeft)
  }, [page, ref]);

  return <>
    <SectionHeader id="coming-up">Termine und Angebote</SectionHeader>
    <div className={`flex gap-8 py-12 overflow-hidden relative -mx-4 p-4 lg:m-0 lg:p-0`}>
      <div className="rounded-lg p-4 px-6 w-60 z-10 relative overflow-hidden shrink-0 hidden lg:block">
        <div className=" z-10 absolute inset-0"/>
        {groups.map(([group], index) => <motion.div
            key={group}
            className={`p-1 cursor-pointer z-20 relative`}
            onClick={() => setPage(index)}
            animate={{fontWeight: index === page ? 800 : 400}}
            children={group}
          />
        )}
      </div>
      <motion.div className="lg:hidden absolute top-1/2 right-4 z-20 -translate-x-full -translate-y-1/2 p-1">
        <motion.svg width="12" height="20" className="text-black"
             animate={{
               opacity: page === 0 ? 1 : 0,
               x:  page === 0 ? 0 : 50
             }}>
          <path d={"M 0 0 L 10 10 L 0 20"} stroke="currentColor" strokeWidth="3" fill="none"/>
        </motion.svg>
      </motion.div>
      <div
        className="hidden lg:block absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-back to-transparent z-10 pointer-events-none"/>
      <motion.div
        ref={ref}
        className="flex cursor-grab relative"
        drag="x"
        onMouseUp={() => {
          const step = -Math.sign(0)
          setPage(Math.min(Math.max(page + step, 0), groups.length - 1))
        }}
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
              className={`py-4 px-7 bg-white rounded-lg shadow border border-black/10 w-[calc(100vw-50px)] lg:w-[500px] shrink-0 ${clickToJump && "cursor-pointer"}`}
              onClick={clickToJump ? () => setPage(index) : undefined}
              animate={[
                {opacity: 0, scale: 1.05},
                {opacity: 1},
                {opacity: 0.5, scale: 0.95},
              ][Math.sign(index - page) + 1]}
            >
              <div className="text-xl font-semibold mb-4 mt-2">{group}</div>
              <div>
                <ListView search="" editable={false} items={Object.values(eventsObject).flat()} liturgy={{}}
                          filter={null}/>
              </div>
            </motion.div>;
          }
        )}
      </motion.div>
    </div>
  </>;
}

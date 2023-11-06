import {useState} from "@/app/(shared)/use-state-util";
import {FilterType} from "../../components/calendar/Calendar";
import {useRouter, useSearchParams} from "next/navigation";
import {Dispatch, SetStateAction, useEffect} from "react";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {CalendarName} from "@/domain/events/CalendarInfo";

export const useFilterState = (): [FilterType, Dispatch<SetStateAction<FilterType>>] => {
  const [filter, setFilter] = useState<FilterType>(null);
  const [firstFilterUpdate, setFirstFilterUpdate] = useState(true);
  const searchParams = useSearchParams();
  const {replace: routerReplace} = useRouter();

  useEffect(() => {
    if (searchParams.get("q")) setFilter({filterType: "GROUP", group: searchParams.get("q") as CalendarGroup})
    if (searchParams.get("p")) setFilter({filterType: "PARISH", parish: searchParams.get("p") as CalendarName})
  }, [searchParams]);
  useEffect(() => {
    if (!firstFilterUpdate) {
      routerReplace("?" + Object.entries({
        q: filter?.filterType !== "GROUP" ? null : filter.group,
        p: filter?.filterType !== "PARISH" ? null : filter.parish
      })
        .filter(([_, b]) => b)
        .map(([a, b]) => `${a}=${b}`)
        .join("&")
      )
    } else {
      setFirstFilterUpdate(false);
    }
  }, [filter]);

  return [filter, setFilter];
}

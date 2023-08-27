import {CalendarName} from "../(domain)/events/CalendarInfo";

export const Links = {
  Weekly: (parish: CalendarName) => `/wochenmitteilungen/${parish}`,
}
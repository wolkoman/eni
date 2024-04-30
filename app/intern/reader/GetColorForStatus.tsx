import {ReaderStatus} from "@/domain/service/Service";

export function getColorForStatus(status: ReaderStatus) {
  return {
    cancelled: "bg-red-600",
    assigned: "bg-blue-500",
    informed: "bg-green-600"
  }[status];
}

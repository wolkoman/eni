import {ReaderStatus} from "@/domain/service/Service";
import {getColorForStatus} from "@/app/intern/reader/GetColorForStatus";

export function LiturgyStatus(props: { status: ReaderStatus }) {
  return <div className={`w-3 h-3 my-1.5 rounded ${getColorForStatus(props.status)}`}/>;
}

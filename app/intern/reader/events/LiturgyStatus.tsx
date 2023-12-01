import {ReaderStatus} from "../../../(domain)/service/Service";

export function LiturgyStatus(props: { status: ReaderStatus }) {
    const statusColors = {assigned: 'bg-blue-500', informed: 'bg-green-600', cancelled: 'bg-red-600'};
    return <div className={`w-3 h-3 my-1.5 rounded ${statusColors[props.status]}`}/>;
}

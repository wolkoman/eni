import {useRive} from "@rive-app/react-canvas";

export function EniLoading(props: {noPadding?: boolean}) {
    const {RiveComponent} = useRive({
        src: '/loading.riv',
        autoplay: true,
        stateMachines: "state"
    });
    return <div className={`w-full ${props.noPadding ? '' : 'h-80'} flex items-center justify-center`}>
        <div className="p-3 relative w-24 h-24">
            <RiveComponent/>
        </div>
    </div>;

}
import {useRive} from "@rive-app/react-canvas";
import React from "react";

export function EniLoading() {
    const {RiveComponent} = useRive({
        src: '/loading.riv',
        autoplay: true,
        stateMachines: "state"
    });
    return <div className="w-full h-80 flex items-center justify-center">
        <div className="p-3 relative w-24 h-24">
            <RiveComponent/>
        </div>
    </div>;

}
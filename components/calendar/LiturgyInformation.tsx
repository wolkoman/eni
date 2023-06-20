import {Liturgy} from "../../pages/api/liturgy";
import {Preference, usePreference} from "../../util/store/use-preference";
import {compareLiturgy} from "../../pages/intern/reader/my";
import React from "react";

export function LiturgyInformation(props: { liturgies?: Liturgy[] }) {
    const [liturgyInformation] = usePreference(Preference.LiturgyInformation);

    return liturgyInformation ? <div className="mb-3 text-sm relative z-10">
        {props.liturgies?.sort(compareLiturgy).map((liturgy) =>
            <div className="-my-0.5 italic flex gap-2">
                <div className={`w-3 my-1 rounded ${{
                    v: "bg-[#f0f]",
                    w: "bg-[#ddd]",
                    g: "bg-[#0c0]",
                    r: "bg-[#f00]"
                }[liturgy.color]}`}/>
                <div>{liturgy.name} [{liturgy.rank}]</div>
            </div>
        )}
    </div>: <></>;
}
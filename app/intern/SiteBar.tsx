import React, {ReactNode} from "react";

export function SiteBar(props: { children: ReactNode }) {
    return <div className={`print:hidden bg-white sticky top-0 z-50 border-y border-black/20`}>
        <div className={"max-w-5xl mx-auto py-2 px-4 flex justify-between items-center rounded"}>
            {props.children}
        </div>
    </div>;
}
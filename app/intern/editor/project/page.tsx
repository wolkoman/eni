import {EditorProjectPage} from "./EditorProjectPage";
import React, {Suspense} from "react";

export default async function HomePage() {
    return <Suspense fallback={"lädt..."}><EditorProjectPage/></Suspense>
}

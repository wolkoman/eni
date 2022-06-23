import {useEffect, useState} from "react";
import {site} from "../util/sites";

export function useEmmausProd() {
    const [emmausProd, setEmmausProd] = useState(false);
    useEffect(() => {
        setEmmausProd(!location.href.includes("//localhost") && site(false, true));
    }, []);
    return emmausProd;
}
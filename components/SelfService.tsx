import React, {ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {CalendarName, getCalendarInfo} from "../util/calendar-info";
import {EniLoading} from "./Loading";

type SSProps<S> = { name: keyof S, form: [S, Dispatch<SetStateAction<S>>] };
type SSType = Record<string, any>;

export function Field(props: { children: ReactNode, label: string }) {
    return <div className=" my-2">
        <div className="text-sm">{props.label}</div>
        {props.children}
    </div>;
}

export function SelfServiceInput<S extends SSType>(props: { type?: string, input?: 'textarea', disabled?: boolean } & SSProps<S>) {
    const Tag = props.input ?? "input";
    return <Tag
        {...(Tag === "input" ? {type: props.type} : {})}
        disabled={props.disabled}
        value={props.form[0][props.name]}
        onChange={({target}) => props.form[1](rest => ({...rest, [props.name]: target.value}))}
        className={`bg-white rounded focus:border-black/50 text-lg font-bold ${props.disabled ? '' : 'px-3 py-1 border border-black/20'} outline-none w-full ${props.input === "textarea" && 'h-36'}`}
    />;
}


export function SelfServiceParish<S extends SSType>(props: SSProps<S>) {
    const value = props.form[0][props.name];
    return <div className="grid grid-cols-3 gap-3 text-center">
        {[CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
            .map(name => getCalendarInfo(name))
            .map(info => <div
                onClick={() => props.form[1](rest => ({...rest, [props.name]: info.id}))}
                className={(value === info.id ? info.className : "bg-black/10 opacity-50") + " px-4 py-2 rounded cursor-pointer"}>
                Pfarre {info.shortName}</div>)
        }</div>;
}

export type SelfServiceFile = { id: string, index: number, name: string, result: string, finished: boolean };
export function SelfServiceFileUpload<S extends SSType>(props: SSProps<S>) {

    const [fileList, setFileList] = [
        props.form[0][props.name] as SelfServiceFile[],
        (fn: (files: SelfServiceFile[]) => SelfServiceFile[]) => props.form[1](rest => ({...rest, [props.name]:fn(rest[props.name] as SelfServiceFile[])}))
    ] as const;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const id = Math.random().toString();
        const fileList = e.target.files;
        const files = fileList ? [...fileList] : [];
        const data = new FormData();
        files.forEach((file, i) => {
            data.append(`file-${i}`, file, file.name);
            setFileList(fileList => [...fileList, {id, index: i, name: file.name, result: "", finished: false}])
        });
        fetch('https://api.eni.wien/files-v0/upload.php', {
            method: 'POST',
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setFileList(files => files.map(file => file.id === id ? {
                    ...file,
                    finished: true,
                    result: data[file.index]
                } : file))
            })
            .catch((err) => {
                setFileList(files => files.filter(file => file.id !== id))
                console.error(err);
            });
    };

    return <label htmlFor="dropzone-file"
                  className="flex flex-col h-44 border border-black/20 rounded cursor-pointer hover:bg-black/[2%] relative">
        {fileList.length == 0 ? <div className="flex flex-col items-center justify-center h-full">
            <svg aria-hidden="true" className="w-10 h-10 mb-3" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="">Hochladen</p>
        </div> : <div className="p-4 flex flex-col gap-2">
            {fileList.map(file => <div className={file.finished ? 'font-bold' : 'animate-pulse'}>
                {file.name}{file.finished ? '' : '...'}
            </div>)}
            {fileList.some(file => !file.finished) &&
                <div className="absolute left-0 w-full top-0">
                    <EniLoading noPadding={true}/>
                </div>}
        </div>}
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} multiple/>
    </label>;
}
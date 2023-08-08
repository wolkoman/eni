import React, {ChangeEvent, Dispatch, ReactNode, SetStateAction} from "react";
import {EniLoading} from "./Loading";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";

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
                className={(value === info.id ? info.className : "bg-black/10 opacity-50") + " p-2 rounded cursor-pointer"}>
                {info.shortName}</div>)
        }</div>;
}

export type SelfServiceFile = { id: string, index: number, name: string, result: string, finished: boolean };


export function SelfServiceFileUpload<S extends SSType>(props: SSProps<S>) {

    const [fileList, setFileList] = [
        props.form[0][props.name] as SelfServiceFile[],
        (fn: (files: SelfServiceFile[]) => SelfServiceFile[]) => props.form[1](rest => ({
            ...rest,
            [props.name]: fn(rest[props.name] as SelfServiceFile[])
        }))
    ] as const;


    const onDelete = (fileUrl: string) => {
        setFileList(list => list.filter(file => file.result !== fileUrl))
        fetch(
            `https://api.eni.wien/files-v0/delete.php?file=${fileUrl.split("/").at(-1)}`,
            {method: 'POST'}
        )
    };

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
                    result: `https://api.eni.wien/files-v0/uploads/${data[file.index]}`
                } : file))
            })
            .catch((err) => {
                setFileList(files => files.filter(file => file.id !== id))
                console.error(err);
            });
    };

    let uploadEverywhere = fileList.length == 0;
    return <label
        htmlFor={uploadEverywhere ? "dropzone-file" : ""}
        className={`flex flex-col h-44 border border-black/20 rounded relative overflow-hidden ${uploadEverywhere ? 'cursor-pointer hover:bg-black/[2%]' : ''}`}
    >
        {uploadEverywhere ? <div className="flex flex-col items-center justify-center h-full">
            <svg aria-hidden="true" className="w-10 h-10 mb-3" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="">Hochladen</p>
        </div> : <div className="flex flex-col min-h-full">
            {fileList
                .filter(file => file.finished)
                .map(file => <FileItem key={file.id} name={file.name} link={file.result} onDelete={() => onDelete(file.result)}/>)
            }
            {fileList
                .filter(file => !file.finished)
                .map(file => <FileItem key={file.id} name={file.name}/>)
            }
            {fileList.some(file => !file.finished) &&
                <div className="absolute left-0 w-full top-0"><EniLoading noPadding={true}/></div>
            }
            <div className="grow"/>
            <label htmlFor="dropzone-file">
                <div
                    className="absolute bg-white bottom-0 right-0 px-2 py-1 border-black/20 border-l border-t rounded-tl cursor-pointer">Hochladen
                </div>
            </label>
        </div>}
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} multiple/>
    </label>;
}

function FileItem(props: { name: string, link?: string, onDelete?: () => void }) {
    const Content = () => <div className="flex justify-between border-b border-black/20 px-2 py-1">
        <div className="truncate">{props.name}</div>
        <div className="px-3 hover:bg-red-700 hover:text-white rounded" onClick={e => {
            e.stopPropagation();
            props.onDelete?.();
        }}>X
        </div>
    </div>
    return props.link
        ? <div onClick={() => { window.open(props.link)}} className="hover:bg-black/5 cursor-pointer"><Content/></div>
        : <div className='animate-pulse'><Content/></div>;
}

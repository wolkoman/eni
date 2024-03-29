"use client"
import {Collections} from 'cockpit-sdk';
import React, {useEffect, useState} from 'react';
import Site from '../../../components/Site';
import {EniLoading} from "../../../components/Loading";
import {useUserStore} from "../../(store)/UserStore";
import {usePermission} from "../../(shared)/UsePermission";
import {Permission} from "../../(domain)/users/Permission";
import {fetchJson} from "../../(shared)/FetchJson";
import {InternButton} from "../InternSite";
import Link from "next/link";
import {Clickable} from "../../(shared)/Clickable";
import {Links} from "../../(shared)/Links";

export default function EditorPage() {

    const [projects, setProjects] = useState<Collections['paper_projects'][]>();
    const user = useUserStore(state => state.user);
    usePermission([Permission.Editor]);
    useEffect(() => {
        fetchJson(Links.ApiEditorProjects).then(projects => setProjects(projects));
    }, [setProjects])

    return <Site title="Projekte der Redaktionen" showTitle={true}>
        <>{!projects && <EniLoading/>}</>
        <div className="grid grid-cols-1 md:grid-cols-3 m-2 gap-3">
            {projects?.filter(project => user?.parish === 'all'
                || (project.name.startsWith("EB") && user?.parish === 'emmaus')
                || (project.name.toLowerCase().startsWith("blick") && user?.parish === 'inzersdorf')
            )
                .map(project => <Clickable href={Links.ProjektplattformProjekt(project._id)} key={project._id}><div className="p-4">
                    <div className="text-2xl font-bold">{project.name}</div>
                    <div
                        className="text-lg font-medium">Redaktionsschluss: {new Date(project.deadline).toLocaleDateString("de-AT")}</div>
                </div></Clickable>)}
        </div>
    </Site>
}

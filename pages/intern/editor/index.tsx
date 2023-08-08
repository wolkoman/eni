import {Collections} from 'cockpit-sdk';
import React, {useEffect, useState} from 'react';
import Site from '../../../components/Site';
import {InternButton} from "../../../components/InternButton";
import {EniLoading} from "../../../components/Loading";
import {useUserStore} from "@/store/UserStore";
import {usePermission} from "@/app/(shared)/UsePermission";
import {Permission} from "@/domain/users/Permission";
import {fetchJson} from "@/app/(shared)/FetchJson";

export default function Index() {

    const [projects, setProjects] = useState<Collections['paper_projects'][]>();
    const user = useUserStore(state => state.user);
    usePermission([Permission.Editor]);
    useEffect(() => {
        fetchJson("/api/editor/projects").then(projects => setProjects(projects));
    }, [setProjects])

    return <Site title="Projekte der Redaktionen" showTitle={true}>
        <>{!projects && <EniLoading/>}</>
        <div className="grid grid-cols-1 md:grid-cols-3 m-2 gap-3">
            {projects?.filter(project => user?.parish === 'all'
                || (project.name.startsWith("EB") && user?.parish === 'emmaus')
                || (project.name.toLowerCase().startsWith("blick") && user?.parish === 'inzersdorf')
            )
                .map(project => <InternButton href={`editor/project?projectId=${project._id}`} key={project._id}>
                    <div className="text-2xl font-bold">{project.name}</div>
                    <div
                        className="text-lg font-medium">Redaktionsschluss: {new Date(project.deadline).toLocaleDateString("de-AT")}</div>
                </InternButton>)}
        </div>
    </Site>
}

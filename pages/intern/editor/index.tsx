import {Collections} from 'cockpit-sdk';
import React, {useEffect, useState} from 'react';
import Site from '../../../components/Site';
import {fetchJson} from "../../../util/fetch-util";
import {useAuthenticatedUserStore} from "../../../util/use-user-store";
import {InternButton} from "../../../components/InternButton";
import {usePermission} from "../../../util/use-permission";
import {Permission} from "../../../util/verify";

export default function Index() {

    const [projects, setProjects] = useState<Collections['paper_projects'][]>();
    const {user} = useAuthenticatedUserStore();
    usePermission([Permission.Editor]);
    useEffect(() => {
        fetchJson("/api/editor/projects").then(projects => setProjects(projects));
    }, [setProjects])

    return <Site title="Projekte der Redaktionen">
        <div className="grid grid-cols-1 md:grid-cols-3 m-2 gap-3">
            {projects?.filter(project => user?.parish === 'all'
                || (project.name.startsWith("EB") && user?.parish === 'emmaus')
                || (project.name.toLowerCase().startsWith("blick") && user?.parish === 'inzersdorf')
            )
                .map(project => <InternButton href={`editor/project?projectId=${project._id}`} key={project._id}>
                    <div className="text-2xl font-bold">{project.name}</div>
                    <div
                        className="text-lg">Redaktionsschluss: {new Date(project.deadline).toLocaleDateString("de-AT")}</div>
                </InternButton>)}
        </div>
    </Site>
}
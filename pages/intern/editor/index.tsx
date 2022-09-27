import {Collections} from 'cockpit-sdk';
import React, {useEffect, useState} from 'react';
import Site from '../../../components/Site';
import {fetchJson} from "../../../util/fetch-util";
import {useUserStore} from "../../../util/use-user-store";
import {InternButton} from "../../../components/InternButton";

export default function Index() {

    const [projects, setProjects] = useState<Collections['paper_projects'][]>();
    const jwt = useUserStore(state => state.jwt)
    useEffect(() => {
        if (jwt === undefined) return;
        fetchJson("/api/editor/projects", {jwt}).then(projects => setProjects(projects));
    }, [setProjects, jwt])

    return <Site title="Projekte der Redaktionen">
        <div className="grid grid-cols-1 md:grid-cols-3 m-2 gap-3">
            {projects?.map(project => <InternButton href={`editor/project?projectId=${project._id}`} key={project._id}>
                <div className="text-2xl font-bold">{project.name}</div>
                <div className="text-lg">Redaktionsschluss: {new Date(project.deadline).toLocaleDateString("de-AT")}</div>
            </InternButton>)}
        </div>
    </Site>
}
import {Collections} from 'cockpit-sdk';
import React, {useEffect, useState} from 'react';
import Site from '../../../components/Site';
import Link from "next/link";
import {fetchJson} from "../../../util/fetch-util";
import {useUserStore} from "../../../util/use-user-store";

export default function Index() {

  const [projects, setProjects] = useState<Collections['paper_projects'][]>();
  const jwt = useUserStore(state => state.jwt)
  useEffect(() => {
    if(jwt === undefined) return;
    fetchJson("/api/editor/projects", {jwt}).then(projects => setProjects(projects));
  },[setProjects, jwt])

  return <Site title="Projekte der Redaktionen">
    <div className="grid grid-cols-1 md:grid-cols-3 m-2">
    {projects?.map(project => <Link href={`editor/project?projectId=${project._id}`} key={project._id}>
      <div className="rounded-xl shadow border border-black/10 h-32 flex flex-col justify-center p-6 hover:bg-black/[3%] cursor-pointer">
        <div className="text-2xl">{project.name}</div>
        <div className="">Readktionsschluss: {new Date(project.deadline).toLocaleDateString()}</div>
    </div></Link>)}
    </div>
  </Site>
}
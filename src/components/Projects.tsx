import Link from "@docusaurus/Link";
import clsx from "clsx";
import React from "react";
import { Icon } from "@iconify/react";
import "../css/projects.css";

const projects: Project[] = [
  {
    title: "Paper",
    description:
      "High performance Minecraft server that aims to fix gameplay and mechanics inconsistencies.",
    repo: "PaperMC/Paper",
    modules: [
      { name: "Administration", link: "/paper/admin" },
      { name: "Development", link: "/paper/dev" },
      { name: "Contributing", link: "/paper/contributing" },
    ],
  },
  {
    title: "Folia",
    description: "A fork of Paper which adds regionized multithreading to the dedicated server.",
    repo: "PaperMC/Folia",
    modules: [
      { name: "Administration", link: "/folia/admin" },
      { name: "Development", link: "/folia/dev" },
    ],
  },
  {
    title: "Velocity",
    description: "The modern, next-generation Minecraft server proxy.",
    repo: "PaperMC/Velocity",
    modules: [
      { name: "Administration", link: "/velocity/admin" },
      { name: "Development", link: "/velocity/dev" },
    ],
  },
  {
    title: "Miscellaneous",
    description: "Documentation that does not apply to any specific project.",
    repo: "PaperMC",
    link: "/misc",
  },
  {
    title: "Waterfall",
    description:
      "A Discontinued BungeeCord proxy fork that aimed to improve performance and stability.",
    repo: "PaperMC/Waterfall",
    link: "/waterfall",
    eol: true,
  },
];

function Project(project: Project) {
  return (
    <div className={"project"}>
      <div>
        <Link
          className={clsx("projectGitHub", project.eol && "archivedProjectTitle")}
          to={`https://github.com/${project.repo}`}
        >
          {project.title}
          {project.eol && <Icon className={"margin-left--sm"} icon={"mdi:archive"} height={25} />}
        </Link>
        <p>{project.description}</p>
      </div>
      <div>
        {project.modules?.map((module, index) => (
          <Link key={index} className={"button button--primary"} to={module.link}>
            {module.name}
          </Link>
        ))}
        {project.link && (
          <Link className={"button button--primary"} to={project.link}>
            Go
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Projects(): JSX.Element {
  return (
    <section className={"projects"}>
      <div className={"projectsContainer"}>
        {projects.map((project, index) => (
          <Project key={index} {...project} />
        ))}
      </div>
    </section>
  );
}

interface Project {
  title: string;
  description: string;
  repo: string;
  link?: string;
  modules?: Module[];
  eol?: boolean;
}

interface Module {
  name: string;
  link: string;
}

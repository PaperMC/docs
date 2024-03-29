import Link from "@docusaurus/Link";
import React from "react";
import { Icon } from "@iconify/react";
import "../css/projects.css";

const projects: Project[] = [
  {
    title: "Paper",
    description:
      "High performance Minecraft server that aims to fix gameplay and mechanics inconsistencies.",
    repo: "PaperMC/Paper",
    link: "/paper",
  },
  {
    title: "Folia",
    description: "A fork of Paper which adds regionized multithreading to the dedicated server.",
    repo: "PaperMC/Folia",
    link: "/folia",
  },
  {
    title: "Velocity",
    description: "The modern, next-generation Minecraft server proxy.",
    repo: "PaperMC/Velocity",
    link: "/velocity",
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
      <div className={"flex"}>
        <Link
          className={"projectGitHub " + (project.eol ? "archivedProjectTitle" : "")}
          to={`https://github.com/${project.repo}`}
        >
          {project.title}
          {project.eol && <Icon style={{ marginLeft: "8px" }} icon={"mdi:archive"} height={25} />}
        </Link>
        <p>{project.description}</p>
      </div>
      <div>
        <Link className={"button button--primary " + (project.eol ? "archivedProjectButton" : "")} to={project.link}>
          Go
        </Link>
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
  link: string;
  eol?: boolean;
}

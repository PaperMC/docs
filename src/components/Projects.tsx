import Link from "@docusaurus/Link";
import React from "react";
import styles from "../css/projects.module.css";
import clsx from "clsx";

const projects: Project[] = [
  {
    title: "Paper",
    description:
      "High performance Minecraft server that aims to fix gameplay and mechanics inconsistencies.",
    repo: "PaperMC/Paper",
    admin: "/paper",
    developer: "/dev/paper",
  },
  {
    title: "Velocity",
    description: "The modern, next-generation Minecraft server proxy.",
    repo: "PaperMC/Velocity",
    admin: "/velocity",
    developer: "/dev/velocity",
  },
  {
    title: "Waterfall",
    description: "BungeeCord proxy fork that aims to improve performance and stability.",
    repo: "PaperMC/Waterfall",
    admin: "/waterfall",
  },
];

function Project(project: Project) {
  return (
    <div className={styles.project}>
      <div className={styles.flex}>
        <Link className={styles.projectGitHub} to={`https://github.com/${project.repo}`}>
          {project.title}
        </Link>
        <p>{project.description}</p>
      </div>
      <div className={styles.links}>
        {project.admin ? (
          <Link className="button button--primary link" to={project.admin}>
            Server Admin
          </Link>
        ) : null}
        {project.developer ? (
          <Link
            className={clsx("button", "button--primary", "link", project.admin && "margin-top--sm")}
            to={project.developer}
          >
            Developer
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default function Projects(): JSX.Element {
  return (
    <section className={styles.projects}>
      <div className={styles.projectsContainer}>
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
  admin?: string;
  developer?: string;
}

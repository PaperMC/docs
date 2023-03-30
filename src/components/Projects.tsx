import Link from "@docusaurus/Link";
import React from "react";
import styles from "../css/projects.module.css";

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
    title: "Waterfall",
    description: "BungeeCord proxy fork that aims to improve performance and stability.",
    repo: "PaperMC/Waterfall",
    link: "/waterfall",
  },
  {
    title: "Miscellaneous",
    description: "Documentation that does not apply to any specific project.",
    repo: "PaperMC",
    link: "/misc",
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
      <div>
        <Link className="button button--primary" to={project.link}>
          Go
        </Link>
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
  link: string;
}

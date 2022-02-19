import { Link } from "@docusaurus/router";
import React from "react";
import styles from "./Projects.module.css";

const projects: Project[] = [
  {
    title: "Paper",
    description:
      "High performance Minecraft server that aims to fix gameplay and mechanics inconsistencies.",
    link: "/paper",
  },
  {
    title: "Velocity",
    description: "The modern, next-generation Minecraft server proxy.",
    link: "/velocity",
  },
  {
    title: "Waterfall",
    description: "BungeeCord proxy fork that aims to improve performance and stability.",
    link: "/waterfall",
  },
];

function Project(item: Project) {
  return (
    <div className={styles.project}>
      <div className={styles.flex}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      <div>
        <Link className="button button--primary" to={item.link}>
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
  link: string;
}

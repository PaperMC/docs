import React, { useEffect, useState } from "react";
import { getProperty } from "../Property";
import SoftwareVersionFetcher from "../../minecraft-versioning/SoftwareVersionFetcher";

type TargetResolver = (module?: string) => Promise<string>;

const createProjectTarget = (project: string, majorOnly: boolean = false): TargetResolver => {
  return async () => {
    let version = await SoftwareVersionFetcher.getMajorVersion(project);
    if (majorOnly) {
      version = version.split(".")[0] + ".0.0";
    }
    
    return `https://jd.papermc.io/${project}/${version}`;
  };
};

const targets: { [project: string]: TargetResolver } = {
  paper: createProjectTarget("paper"),
  velocity: createProjectTarget("velocity", true),
  java: async (module) => {
    const version = getProperty("DOCS_JAVA") ?? "21";

    return `https://docs.oracle.com/en/java/javase/${version}/docs/api/${module || "java.base"}`;
  },
};

const formatName = (name: string): string => {
  let [name0, hash] = name.split("#", 2);
  name0 = name0.replaceAll(".", "/").replaceAll("$", ".");
  
  return `${name0}.html` + (hash ? `#${hash}` : "");
};

export default function Javadoc({ name, module, project = "paper", children }: JavadocProps) {
  const [href, setHref] = useState<string>(null);

  useEffect(() => {
    (async () => {
      const resolve = targets[project];
      if (resolve) {
        const target = await resolve(module);
        
        setHref(`${target}/${formatName(name)}`);
      }
    })();
  }, [name]);

  return <a href={href}>{children}</a>;
}

interface JavadocProps {
  name: string;
  module?: string;
  project?: "paper" | "velocity" | "java";
  children: any;
}

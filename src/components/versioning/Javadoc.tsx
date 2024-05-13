import React, { useEffect, useState } from "react";
import { getProperty } from "../Property";
import {
  getProjectVersion,
  VersionType,
  type Project,
  type DocusaurusVersion,
} from "../../util/projectUtils";
import { useDocsVersion } from "@docusaurus/theme-common/internal";

type TargetResolver = (baseVersion: DocusaurusVersion | null, module?: string) => Promise<string>;

const createProjectTarget = (
  project: Project,
  versionType: VersionType = VersionType.MajorMinorPatch
): TargetResolver => {
  return async (baseVersion) => {
    const version = await getProjectVersion(project, baseVersion, versionType);

    return `https://jd.papermc.io/${project}/${version}`;
  };
};

const targets: { [project: string]: TargetResolver } = {
  paper: createProjectTarget("paper"),
  velocity: createProjectTarget("velocity", VersionType.MajorZeroed),
  java: async (_, module) => {
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

  const versionMeta = useDocsVersion();
  useEffect(() => {
    (async () => {
      const resolve = targets[project];
      if (resolve) {
        const target = await resolve(versionMeta, module);

        setHref(`${target}/${formatName(name)}`);
      }
    })();
  }, [name]);

  return <a href={href}>{children}</a>;
}

interface JavadocProps {
  name: string;
  module?: string;
  project?: Project | "java";
  children: any;
}

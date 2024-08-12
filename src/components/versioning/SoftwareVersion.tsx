import { useEffect, useState } from "react";
import { getProjectVersion, VersionType, type Project } from "../../util/versionUtils";
import { useDocsVersion } from "@docusaurus/plugin-content-docs/client";

export default function SoftwareVersion({
  versionType = "maj-min-pat",
  project = "paper",
}: SoftwareVersionProps) {
  const [fetched, setFetched] = useState<String>(null);

  const versionMeta = useDocsVersion();
  useEffect(() => {
    (async () => {
      let enumType = VersionType.MajorMinorPatch;
      switch (versionType) {
        case "maj-min":
          enumType = VersionType.MajorMinor;
        case "maj":
          enumType = VersionType.Major;
      }

      setFetched(await getProjectVersion(project, versionMeta, enumType));
    })();
  }, [versionType]);

  return fetched;
}

interface SoftwareVersionProps {
  versionType: "maj-min-pat" | "maj-min" | "maj";
  project?: Project;
}

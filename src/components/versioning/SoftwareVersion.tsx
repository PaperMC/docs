import { useEffect, useState } from "react";
import { getProjectVersion, VersionType, type Project } from "../../util/projectUtils";

export default function SoftwareVersion({
  versionType = "maj-min-pat",
  project = "paper",
}: SoftwareVersionProps) {
  const [fetched, setFetched] = useState<String>(null);

  useEffect(() => {
    (async () => {
      let enumType = VersionType.MajorMinorPatch;
      switch (versionType) {
        case "maj-min":
          enumType = VersionType.MajorMinor;
        case "maj":
          enumType = VersionType.Major;
      }

      setFetched(await getProjectVersion(project, enumType));
    })();
  }, [versionType]);

  return fetched;
}

interface SoftwareVersionProps {
  versionType: "maj-min-pat" | "maj-min" | "maj";
  project?: Project;
}

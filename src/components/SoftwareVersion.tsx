import React, { useEffect, useState } from "react";
import SoftwareVersionFetcher from "../minecraft-versioning/SoftwareVersionFetcher";

export default function SoftwareVersion({ versionType, project = "paper" }: SoftwareVersionProps) {
  const [fetched, setFetched] = useState<String>(null);

  useEffect(() => {
    (async () => {
      let version: string;

      if (versionType === "maj-min") {
        version = await SoftwareVersionFetcher.getMajorMinorVersion(project);
      } else if (versionType === "maj") {
        version = await SoftwareVersionFetcher.getMajorVersion(project);
      } else if (versionType === "max") {
        version = await SoftwareVersionFetcher.getMaxVersion(project);
      } else {
        throw new Error("Invalid version type");
      }

      setFetched(version);
    })();
  }, [versionType]);

  if (!fetched) {
    return null;
  }

  return fetched;
}

interface SoftwareVersionProps {
  versionType: "maj-min" | "maj" | "max"; // maj-min is major.minor, maj is major, max is max version
  project?: "paper" | "velocity";
}

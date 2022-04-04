import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import { sidebar } from "./common";

const sidebars: SidebarsConfig = {
  primary: [...sidebar, "common", "java-install", "downloads-api", "assets", "contact"],
};

export = sidebars;

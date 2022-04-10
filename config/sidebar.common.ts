import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import { sidebar } from "./common";

const common: SidebarsConfig = {
  primary: [...sidebar, "common", "java-install", "downloads-api", "assets", "contact"],
};

export = common;

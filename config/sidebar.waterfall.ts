import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import { sidebar } from "./common";

const waterfall: SidebarsConfig = {
  primary: [...sidebar, "README", "getting-started", "configuration"],
};

export = waterfall;

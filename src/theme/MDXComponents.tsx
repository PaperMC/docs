import { Icon } from "@iconify/react";
import MDXComponents from "@theme-original/MDXComponents";
import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import VersionFormattedCode from "@site/src/components/versioning/VersionFormattedCode";
import SoftwareVersion from "@site/src/components/versioning/SoftwareVersion";
import Javadoc from "../components/versioning/Javadoc";
import Property from "@site/src/components/Property";

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Tabs,
  TabItem,
  // Add a custom mapping
  VersionFormattedCode,
  SoftwareVersion,
  Javadoc,
  Property,
  Icon: Icon,
};

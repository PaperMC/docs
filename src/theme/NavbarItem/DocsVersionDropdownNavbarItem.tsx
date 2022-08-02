import React, { ComponentProps } from "react";
import DocsVersionDropdownNavbarItem from "@theme-original/NavbarItem/DocsVersionDropdownNavbarItem";
import type DocsVersionDropdownNavbarItemType from "@theme/NavbarItem/DocsVersionDropdownNavbarItem";
import { useLocalPathname } from "@docusaurus/theme-common/internal";
import { useDocsData } from "@docusaurus/plugin-content-docs/client";

type Props = ComponentProps<typeof DocsVersionDropdownNavbarItemType>;

// Only render if current page is controlled by version selector
export default function DocsVersionDropdownNavbarItemWrapper(props: Props): JSX.Element {
  return (
    <>
      {useLocalPathname().startsWith(useDocsData(props.docsPluginId).path) && (
        <DocsVersionDropdownNavbarItem dropdownActiveClassDisabled="true" {...props} />
      )}
    </>
  );
}

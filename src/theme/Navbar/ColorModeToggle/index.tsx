import React from "react";
import { useColorMode, useThemeConfig } from "@docusaurus/theme-common";
import ColorModeToggle from "@theme/ColorModeToggle";
import type { Props } from "@theme/Navbar/ColorModeToggle";
import styles from "./styles.module.css";
import ColorGenerator from "@site/src/april-fools/ColorGenerator";

export default function NavbarColorModeToggle({ className }: Props): JSX.Element | null {
  const navbarStyle = useThemeConfig().navbar.style;
  const disabled = useThemeConfig().colorMode.disableSwitch;
  const { colorMode, setColorMode } = useColorMode();

  if (disabled) {
    return null;
  }

  return (
    <ColorModeToggle
      className={className}
      buttonClassName={navbarStyle === "dark" ? styles.darkNavbarColorModeToggle : undefined}
      value={colorMode}
      onChange={(value) => {
        if (
          ColorGenerator.isAprilFools() &&
          (typeof localStorage !== "undefined"
            ? localStorage.getItem("foolsMode") === "true"
            : false)
        )
          ColorGenerator.colorThemeChanged(value);
        setColorMode(value);
      }}
    />
  );
}

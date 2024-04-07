import React from 'react';
import Logo from '@theme/Logo';
import {useThemeConfig} from "@docusaurus/theme-common";
import ThemedImage from "@theme/ThemedImage";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import './styles.css';

interface IconInfo {
  light: string;
  dark: string;
}

interface Icons {
  [key: string]: IconInfo;
}

const ICONS : Icons = {
  paper: {
    light: "/img/platform-icons/paper_light.svg",
    dark: "/img/platform-icons/paper_dark.svg"
  },
  folia: {
    light: "/img/platform-icons/folia_light.svg",
    dark: "/img/platform-icons/folia_dark.svg"
  },
  velocity: {
    light: "/img/platform-icons/velocity_light.svg",
    dark: "/img/platform-icons/velocity_dark.svg"
  }
};

const renderIcon = (label: string, icon: IconInfo) => (
  <Link to={"/"} className={"project-icon"}>
    <ThemedImage sources={icon} className={clsx("navbar__logo navbar__brand", "project-icon")}/>
  </Link>
);

export default function NavbarLogo(): JSX.Element {
  for (let item of useThemeConfig().navbar.items) {
    if (item.activeBaseRegex && new RegExp(item.activeBaseRegex).test(location.pathname)) {
      switch (item.label) {
        case "Paper":
          return renderIcon(item.label, ICONS.paper);
        case "Folia":
          return renderIcon(item.label, ICONS.folia);
        case "Velocity":
          return renderIcon(item.label, ICONS.velocity);
      }
    }
  }
  return (
    <Logo
      className="navbar__brand"
      imageClassName="navbar__logo"
      titleClassName="navbar__title text--truncate"
    />
  );
}

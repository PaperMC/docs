import React, {useState} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import FoolsModeToggleButton from '@site/src/theme/FoolsModeToggle';
import type {Props} from '@theme/Navbar/ColorModeToggle';
import styles from './styles.module.css';

export default function FoolsModeToggle({
  className,
}: Props): JSX.Element | null {
  const navbarStyle = useThemeConfig().navbar.style;
  const [colorMode, setColorMode] = useState(localStorage.getItem("foolsMode") === "true");

  return (
    <FoolsModeToggleButton
      className={className}
      buttonClassName={
        navbarStyle === 'dark' ? styles.darkNavbarColorModeToggle : undefined
      }
      value={colorMode ? "light" : "dark"}
      onChange={value => {
        setColorMode(value === "light");

        localStorage.setItem("foolsMode", localStorage.getItem("foolsMode") === "true" ? "false" : "true");
        location.reload();
      }}
    />
  );
}

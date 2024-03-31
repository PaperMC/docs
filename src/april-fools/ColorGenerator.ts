import {ColorMode} from "@docusaurus/theme-common";

export default class ColorGenerator {

  static PROPERTIES : string[] = [
    "--ifm-color-primary", "--ifm-color-primary-dark",
    "--ifm-color-secondary", "--ifm-color-secondary-dark",
    "--ifm-color-warning-contrast-background", "--ifm-heading-color",
    "--ifm-menu-color", "--ifm-color-content",
    "--ifm-color-emphasis-800", "--ifm-menu-color",
  ];

  static ENABLED : boolean = false;
  static darkMode: boolean = localStorage.getItem("theme") === "dark";


  public static enable() {
    ColorGenerator.setColors();
  }

  public static colorThemeChanged(theme: ColorMode) {
    if (ColorGenerator.darkMode !== (theme === "dark")) {
      ColorGenerator.ENABLED = false;
      ColorGenerator.darkMode = theme === "dark";
      ColorGenerator.setColors();
    }
  }

  static setColors() {

    if (ColorGenerator.ENABLED) return;

    const root = document.documentElement;

    for (const property of ColorGenerator.PROPERTIES) {
      root.style.setProperty(property, ColorGenerator.randomHex(), "important");
    }

    ColorGenerator.ENABLED = true;
  }

  static randomHex() {
    // Define the range for vivid colors in RGB space
    const minValue = !ColorGenerator.darkMode ? 0 : 100;
    const maxValue = !ColorGenerator.darkMode ? 155 : 255;

    // Generate random RGB values within the defined range
    const red = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    const green = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    const blue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

    // Convert RGB values to hex string
    return '#' + red.toString(16).padStart(2, '0') +
      green.toString(16).padStart(2, '0') +
      blue.toString(16).padStart(2, '0');
  }
}

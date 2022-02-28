import vsDark from "prism-react-renderer/themes/vsDark/index.cjs.js";

/** @type {import("prism-react-renderer").PrismTheme} */
const theme = {
  plain: {},
  styles: [
    ...vsDark.styles,
    {
      types: ["changed", "punctuation"],
      style: {
        color: "rgb(127,180,224)"
      }
    }
  ],
};

export default theme;

import { createHighlighter } from "shiki";
import MiniMessageLang from "../assets/mm.tmLanguage.json";

import starlightConfig from "virtual:starlight/user-config";
import NightOwlDark from "../assets/themes/night-owl-dark.json";
import NightOwlLight from "../assets/themes/night-owl-light.json";

let themes: Array<any> | undefined = undefined;

if (typeof starlightConfig.expressiveCode === "object") {
  themes = starlightConfig.expressiveCode.themes;
}

themes = themes ?? [NightOwlDark, NightOwlLight];

let highlighter = await createHighlighter({
  langs: [MiniMessageLang, "java"],
  themes: themes,
});

export const getHighlighter = () => highlighter;

export const highlight = (code: string, lang: string) => {
  const html = highlighter.codeToHtml(code, {
    lang: lang,
    themes: {
      dark: themes[1],
      light: themes[0],
    },
  });

  return html.replace("pre", "a").replace("</pre>", "</a>");
};

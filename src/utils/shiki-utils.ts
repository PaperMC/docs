import { createHighlighter } from "shiki";
import MiniMessageLang from "../assets/mm.tmLanguage.json";

// import NightOwlDark from "@astrojs/starlight/integrations/expressive-code/themes/night-owl-dark.jsonc";
// import NightOwlLight from "@astrojs/starlight/integrations/expressive-code/themes/night-owl-light.jsonc";
import starlightConfig from "virtual:starlight/user-config";

let themes: Array<any> | undefined = undefined;

if (typeof starlightConfig.expressiveCode === "object") {
  themes = starlightConfig.expressiveCode.themes;
}

// themes = themes ?? ["night-owl", "night-owl"];
themes = ["night-owl", "one-light"]

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

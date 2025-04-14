import { createHighlighter } from "shiki";

import MiniMessage from "../../assets/mm.tmLanguage.json";

const highlighter = await createHighlighter({
  themes: ["one-dark-pro", "one-light"],
  langs: ["java", MiniMessage],
});

highlighter.loadLanguage();

const inlineCodeRegex = /:\w+:\`.+\`/g;
const langRegex = /:\w+:/g;
const codeRegex = /\`.+\`/g;

function plugin() {
  return function (tree, file) {
    console.log(file);

    const rawContent = file.value;
    let content = rawContent;

    let match = null;
    do {
      match = inlineCodeRegex.exec(content);
      if (match) {
        const matchContent: string = match[0];

        let rawLang: RegExpExecArray | null = langRegex.exec(matchContent);
        if (rawLang == null) {
          throw "Unexpected error: rawLang is null.";
        }

        let fullLang = rawLang[0];
        let lang: string = fullLang.split(":")[1];

        let rawCode: RegExpExecArray | null = codeRegex.exec(matchContent);
        if (rawCode == null) {
          throw "Unexpected error: rawCode is null.";
        }

        let fullCode: string = rawCode[0];
        let code: string = fullCode.split("`")[1];

        // console.log(
        //   `Lang: ${lang}. Code: ${code}. (FullLang: ${fullLang}. FullCode: ${fullCode}) {${matchContent}}`
        // );

        const output = highlighter.codeToHtml(code, {
          lang: lang,
          theme: "one-dark-pro",
        }).replace("pre", "a").replace("</pre>", "</a>");

        console.log(`Output: ${output}`);
        content = content.replaceAll(match, output);
      }
    } while (match != null);

    // console.log(`Old content: ${rawContent}\nNew Content: ${content}`);
    file.value = content;
    console.log(file);
  };
}

export default plugin;

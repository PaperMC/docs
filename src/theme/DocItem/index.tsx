import React from "react";
import { HtmlClassNameProvider } from "@docusaurus/theme-common";
import { DocProvider } from "@docusaurus/plugin-content-docs/client";
import DocItemMetadata from "@theme/DocItem/Metadata";
import DocItemLayout from "@theme/DocItem/Layout";
import ReactMarkdown from "react-markdown";
import style from "@site/src/css/markdown-styles.module.css";
import type { Props } from "@theme/DocItem";

function EOLMessage(message: string): JSX.Element {
  return (
    <div className={"eol-message"}>
      <p>
        <strong>This project has reached end of life and is no longer maintained.</strong>
      </p>
      <ReactMarkdown className={style.reactMarkDown}>{"**" + message + "**"}</ReactMarkdown>
    </div>
  );
}

export default function DocItem(props: Props): JSX.Element {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;
  const eolPage = props.content?.frontMatter?.eol === true;
  const eolMessage = props.content?.frontMatter?.eol_message || "";

  return (
    <DocProvider content={props.content}>
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata />
        <DocItemLayout>
          <>
            {eolPage && EOLMessage(eolMessage)}
            <MDXComponent />
          </>
        </DocItemLayout>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}

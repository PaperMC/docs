import React from 'react';
import {HtmlClassNameProvider} from '@docusaurus/theme-common';
import {DocProvider} from '@docusaurus/theme-common/internal';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';
import ReactMarkdown from 'react-markdown';
import style from '@site/src/css/markdown-styles.module.css';
import type {Props} from '@theme/DocItem';

function EOLPage(message: string) {
    return (
        <div className={"eol-message"}>
            <ReactMarkdown className={style.reactMarkDown} >{"**" + message + "**"}</ReactMarkdown>
        </div>
    );
}

export default function DocItem(props: Props): JSX.Element {
    const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
    const MDXComponent = props.content;
    const eolPage = props.content?.frontMatter?.eol === true;
    const eolMessage = "This project has reached and of life and is no longer maintained. " + props.content?.frontMatter?.eolMessage || "";

    return (
        <DocProvider content={props.content}>
            <HtmlClassNameProvider className={docHtmlClassName}>
                <DocItemMetadata/>
                <DocItemLayout>
                    <>
                        {
                            eolPage && EOLPage(eolMessage)
                        }
                        <MDXComponent />
                    </>
                </DocItemLayout>
            </HtmlClassNameProvider>
        </DocProvider>
    );
}

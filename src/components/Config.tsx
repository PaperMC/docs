import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import style from '@site/src/css/markdown-styles.module.css';
import yaml from 'js-yaml';

const INDENT_SIZE = 30;

const parseNameToHash = (name: string) => {
    return name.replace(/-/g, "_");
}

interface YamlNode {
    default: string | number | boolean;
    description: string;
}

interface YamlData {
    [key: string]: YamlNode | YamlData;
}

const scrollIntoView = (id: string): void => {
    const targetElement = document.getElementById(id);

    if (!targetElement) {
        console.error(`Element with ID "${id}" not found.`);
        return;
    }

    const navbarHeightRems = 3.75;
    const navbarHeightPixels = navbarHeightRems * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const targetElementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const adjustedScrollPosition = targetElementPosition - navbarHeightPixels;

    setTimeout(() => {
        window.scrollTo({
            top: adjustedScrollPosition - 20,
            behavior: 'smooth',
        });
    }, 1);
}

const YamlNodeWithDescription: React.FC<{
    name: string;
    parentKey: string;
    node: YamlNode;
}> = ({ name, node, parentKey }) => {
    const [showDescription, setShowDescription] = useState(false);

    node.default = node.default || 'N/A';
    node.description = node.description || 'N/A';

    useEffect(() => {
        const hash = parentKey + "_" + parseNameToHash(name);
        if (window.location.hash === `#${hash}`) {
            showAndScrollIntoView(hash);
        }
    }, [name]);

    const handleHashLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault(); // Prevent the default anchor tag behavior. This causes some UI issues with scrolling.

        showAndScrollIntoView(parentKey + "_" + parseNameToHash(name));
        history.pushState(null, null, event.currentTarget.hash);

        const fullURL = window.location.href.split("#")[0];
        const hash = parentKey + "_" + name.replace(/-/g, "_");
        navigator.clipboard.writeText(fullURL + "#" + hash);
        scrollIntoView(hash);

        event.stopPropagation();
    };

    const showAndScrollIntoView = hash => {
        setShowDescription(true);
        scrollIntoView(hash);
    }

    return (
        <div
            style={{ paddingLeft: `${INDENT_SIZE}px` }}
            id={parentKey + "_" + parseNameToHash(name)}
        >
            <div className={`description_word_wrap`}
                 style={{ marginBottom: showDescription ? 10 : 0 }}
            >
                <a
                    onClick={() => {setShowDescription(!showDescription)}}
                    className={`with-value${showDescription ? "-active": ""}`}
                >
                    {name}: {node.default.toString()}
                </a>
                {showDescription ? (
                    <>
                        <a
                            className={`config-anchor with-value-active-colour hash-link`}
                            href={`#${parentKey + "_" + parseNameToHash(name)}`}
                            onClick={handleHashLinkClick}
                        ></a>

                        <div className="indent-2" style={{ marginBottom: 10 }}>
                            <div className="outlined-box description-text colour-offset-box">
                                <ReactMarkdown className={style.reactMarkDown}>{node.description.toString()}</ReactMarkdown>
                            </div>
                        </div>
                    </>
                ) : (
                    <a
                        className={`config-anchor with-value-active-colour hash-link`}
                        href={`#${parentKey + "_" + parseNameToHash(name)}`}
                        onClick={handleHashLinkClick}
                    ></a>
                )}
            </div>
        </div>
    );
};

const renderYamlData = (
    data: YamlData,
    parentKey?: string,
    root: boolean = false
): JSX.Element[] => {
    const renderedNodes: JSX.Element[] = [];

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object') {
            if ('default' in value || 'description' in value) {
                renderedNodes.push(
                    <YamlNodeWithDescription
                        key={key}
                        name={key}
                        parentKey={parentKey}
                        node={value as YamlNode}
                    />
                );
            } else {
                renderedNodes.push(
                    <div
                        key={key}
                        style={{ paddingLeft: `${root ? 0 : INDENT_SIZE}px` }}
                    >
                        <div className={`config-auxiliary-node`}>{key}:</div>
                        {renderYamlData(
                            value as YamlData,
                            parentKey ? parentKey + "_" + parseNameToHash(key) : parseNameToHash(key)
                        )}
                    </div>
                );
            }
        }
    }

    return renderedNodes;
};

export default function Config({ data }: { data: string }): JSX.Element {
    let ymlData: YamlData = yaml.load(data);
    return (
        <div>
            <pre>{renderYamlData(ymlData, "", true)}</pre>
            <div style={{ display: 'none' }}>{data}</div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import style from '../css/markdown-styles.module.css';
import yaml from 'js-yaml';

const INDENT_SIZE = 30;

interface YamlNode {
    default: string | number | boolean;
    description: string;
}

interface YamlData {
    [key: string]: YamlNode | YamlData;
}

const scrollIntoView = (id: string) => {
    const yOffset = -60;
    const element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
};

const YamlNodeWithDescription: React.FC<{
    name: string;
    parentKey: string;
    node: YamlNode;
}> = ({ name, node, parentKey }) => {
    const [showDescription, setShowDescription] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // Track when the mouse is close to the end of the line

    node.default = node.default || 'N/A';
    node.description = node.description || 'N/A';

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    const clickedHashCopy = () => {
        const fullURL = window.location.href.split("#")[0];
        const hash = parentKey + "_" + name.replace(/-/g, "_");
        const hashUrlPart = `#${hash}`;
        navigator.clipboard.writeText(fullURL + hashUrlPart);
        setCopied(true);
        scrollIntoView(hash);

        // Hide the message after 2 seconds
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    useEffect(() => {
        const hash = parentKey + "_" + name.replace(/-/g, "_");
        if (window.location.hash === `#${hash}`) {
            setShowDescription(true);
            scrollIntoView(hash);
        }
    }, [name]);

    return (
        <div
            style={{ paddingLeft: `${INDENT_SIZE}px` }}
            id={parentKey + "_" + name.replace(/-/g, "_")}
            onMouseEnter={() => {setIsHovered(true)}}
            onMouseLeave={() => {setIsHovered(false)}}
        >
            {showDescription ? (
                <>
                    <div className={'with-value-active description'} style={{ marginBottom: 10 }}>
                        <a onClick={toggleDescription}>{name}: {node.default.toString() + ' '}</a>
                        <span
                            className={`config-anchor with-value-active-colour ${isHovered ? 'node-fade-in' : 'node-fade-out'}`}
                            onClick={clickedHashCopy}
                        >
                            #
                        </span>
                        {copied && <div className="copied-message">URL Copied!</div>}
                    </div>

                    <div
                        className="description indent-2"
                        style={{ marginBottom: 10 }}
                    >
                        <div className="outlined-box description-section colour-offset-box">
                            <strong>Description:</strong>
                            <ReactMarkdown className={style.reactMarkDown}>{node.description.toString()}</ReactMarkdown>
                        </div>
                    </div>
                </>
            ) : (
                <div className="description with-value" onClick={toggleDescription}>
                    {name}: {node.default.toString() + ' '}
                    <span
                        className={`config-anchor with-value-active-colour ${isHovered ? 'node-fade-in' : 'node-fade-out'}`}
                        onClick={clickedHashCopy}
                    >
                        #
                    </span>
                </div>
            )}
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
                        {key}:
                        {renderYamlData(
                            value as YamlData,
                            parentKey ? parentKey + "_" + key.replace(/-/g, "_") : key.replace(/-/g, "_")
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

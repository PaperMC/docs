import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import style from '../css/markdown-styles.module.css';
import yaml from 'js-yaml';

const INDENT_SIZE = 15;

interface YamlNode {
    default: string | number | boolean;
    description: string;
}

interface YamlData {
    [key: string]: YamlNode | YamlData;
}

const YamlNodeWithDescription: React.FC<{
    name: string;
    parentKey: string;
    node: YamlNode;
    indentLevel?: number;
}> = ({ name, node, indentLevel = 0 , parentKey}) => {
    const [showDescription, setShowDescription] = useState(false);

    node.default = node.default || 'N/A';
    node.description = node.description || 'N/A';

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    useEffect(() => {
        if (window.location.hash === `#${parentKey + "_" + name.replace(/-/g, "_")}`) {
            setShowDescription(true);
            const element = document.getElementById(parentKey + "_" + name.replace(/-/g, "_"));
            if (element) {
                element.scrollIntoView();
            }
        }
    }, [name]);

    return (
        <div style={{ paddingLeft: `${indentLevel * INDENT_SIZE}px`}} id={parentKey + "_" + name.replace(/-/g, "_")}>
            {showDescription ? (
                <>
                    <div className={'with-value-active'} onClick={toggleDescription} style={{marginBottom: 10}}>
                        {name}: {node.default.toString()}
                    </div>
                    <div
                        className="description indent-2"
                        style={{marginBottom: 10}}
                    >
                        <div className="outlined-box description-section">
                            <strong>Description:</strong>
                            <ReactMarkdown className={style.reactMarkDown}>{node.description.toString()}</ReactMarkdown>
                        </div>
                    </div>
                </>
            ) : (
                <div className="description with-value" onClick={toggleDescription}>
                    {name}: {node.default.toString()}
                </div>
            )}
        </div>
    );
};

const renderYamlData = (
    data: YamlData,
    indentLevel: number = 0,
    parentKey?: string
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
                        indentLevel={indentLevel + 1}
                    />
                );
            } else {
                renderedNodes.push(
                    <div
                        key={key}
                        style={{ paddingLeft: `${(indentLevel + 1) * INDENT_SIZE}px` }}
                    >
                        {key}:
                        {renderYamlData(value as YamlData, indentLevel + 1,
                            parentKey ? parentKey + "_" + key.replace(/-/g, "_") : key.replace(/-/g, "_"))}
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
            <pre>{renderYamlData(ymlData, 0, "")}</pre>
            <div style={{ display: 'none' }}>{data}</div>
        </div>
    );
}
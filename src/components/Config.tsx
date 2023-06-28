import React, { useState } from 'react';

interface YamlNode {
    default: string | number | boolean;
    description: string;
}

interface YamlData {
    [key: string]: YamlNode | YamlData;
}

const YamlNodeWithDescription: React.FC<{ name: string, node: YamlNode; indentLevel?: number }> = ({ name, node, indentLevel = 0 }) => {
    const [showDescription, setShowDescription] = useState(false);

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    return (
        <div
            className={`indent`}
            onClick={toggleDescription}
            style={{ paddingLeft: `${indentLevel * 20}px` }}
        >
            {showDescription ? (
                <>
                    <div className={"with-value"}>{`${name}`}</div>
                    <div className="description" style={{ paddingLeft: `${(indentLevel + 1) * 20}px` }}>
                        Default: {node.default.toString()}
                    </div>
                    <div className="description" style={{ paddingLeft: `${(indentLevel + 1) * 20}px` }}>
                        Description: {node.description.toString()}
                    </div>
                </>
            ) : (
                <div className="description with-value">{`${name}`}: {`${node.default.toString()}`}</div>
            )}
        </div>
    );

};

const renderYamlData = (
    data: YamlData,
    indentLevel: number = 0
): JSX.Element[] => {
    const renderedNodes: JSX.Element[] = [];

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object') {
            if ('default' in value && 'description' in value) {
                renderedNodes.push(
                    <YamlNodeWithDescription key={key} name={key} node={value as YamlNode} indentLevel={indentLevel + 1} />
                );
            } else {
                renderedNodes.push(
                    <div
                        key={key}
                        className={`indent`}
                        style={{ paddingLeft: `${indentLevel * 20}px` }}
                    >
                        {key}:
                        {renderYamlData(value as YamlData, indentLevel + 1)}
                    </div>
                );
            }
        }
    }

    return renderedNodes;
};

export default function Config(data): JSX.Element {

    const YamlViewer = ({ data }) => {
        return (
            <div>
                <pre>{renderYamlData(data.data)}</pre>
            </div>
        );
    };

    return <YamlViewer data={data} />;
}

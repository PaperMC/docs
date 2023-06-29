import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const INDENT_SIZE = 15;

interface YamlNode {
    default: string | number | boolean;
    description: string;
}

interface YamlData {
    [key: string]: YamlNode | YamlData;
}

function highlightSearchString(name, searchString) {
    if (searchString.length === 0) {
        return <span>{name}</span>;
    }

    const regex = new RegExp(`(${searchString})`, 'gi');
    const parts = name.split(regex);

    return (
        <span>
            {parts.map((part, index) => {
                if (part.toLowerCase() === searchString.toLowerCase()) {
                    return <span key={index} className="highlight">{part}</span>;
                }
                return part;
            })}
        </span>
    );
}

const YamlNodeWithDescription: React.FC<{
    name: string;
    node: YamlNode;
    indentLevel?: number;
    searchString: string;
}> = ({ name, node, indentLevel = 0, searchString }) => {
    const [showDescription, setShowDescription] = useState(false);

    const toggleDescription = () => {
        setShowDescription(!showDescription);
    };

    useEffect(() => {
        const handleSearch = (event: KeyboardEvent) => {
            if (searchString.length === 0) {
                return;
            }
            setShowDescription(name.toLowerCase().includes(searchString.toLowerCase()));
        };

        document.addEventListener('keydown', handleSearch);

        return () => {
            document.removeEventListener('keydown', handleSearch);
        };
    }, [searchString, name]);

    return (
        <div className={`indent`} style={{ paddingLeft: `${indentLevel * INDENT_SIZE}px` }}>
            {showDescription ? (
                <>
                    <div className={'with-value'} onClick={toggleDescription} style={{marginBottom: 10}}>{highlightSearchString(name, searchString)}:</div>
                    <div
                        className="description"
                        style={{ paddingLeft: `${(indentLevel + 1) * INDENT_SIZE}px` }}
                    >
                        <div className="description-section">
                            <strong>Default:</strong>
                            <ReactMarkdown>{node.default.toString()}</ReactMarkdown>
                        </div>
                        <div className="description-section">
                            <strong>Description:</strong>
                            <ReactMarkdown>{node.description.toString()}</ReactMarkdown>
                        </div>
                    </div>
                </>
            ) : (
                <div className="description with-value" onClick={toggleDescription}>
                    {highlightSearchString(name, searchString)}: {node.default.toString()}
                </div>
            )}
        </div>
    );
};

const renderYamlData = (
    data: YamlData,
    indentLevel: number = 0,
    searchString: string
): JSX.Element[] => {
    const renderedNodes: JSX.Element[] = [];

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object') {
            if ('default' in value && 'description' in value) {
                renderedNodes.push(
                    <YamlNodeWithDescription
                        key={key}
                        name={key}
                        node={value as YamlNode}
                        indentLevel={indentLevel + 1}
                        searchString={searchString}
                    />
                );
            } else {
                renderedNodes.push(
                    <div
                        key={key}
                        className={`indent`}
                        style={{ paddingLeft: `${indentLevel * INDENT_SIZE}px` }}
                    >
                        {key}:
                        {renderYamlData(value as YamlData, indentLevel + 1, searchString)}
                    </div>
                );
            }
        }
    }

    return renderedNodes;
};

interface ConfigProps {
    data: YamlData;
}

export default function Config({ data }: ConfigProps): JSX.Element {
    const [searchString, setSearchString] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div>
            <div className="search-input">
                <input
                    ref={inputRef}
                    type="text"
                    value={searchString}
                    onChange={handleSearchChange}
                    placeholder="Search"
                />
            </div>
            <pre>{renderYamlData(data, 0, searchString)}</pre>
        </div>
    );
}
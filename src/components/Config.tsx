import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import style from '@site/src/css/markdown-styles.module.css';
import yaml from 'js-yaml';

const INDENT_SIZE = 30;

const createUrlHash = (parent, name) => {
    return parent + (parent ? '_' : '') + parseUrlHash(name);
};

const parseUrlHash = (name) => {
    return name.replace(/-/g, '_');
};

const scrollIntoView = (id) => {
    const targetElement = document.getElementById(id);

    if (!targetElement) {
        console.error(`Element with ID "${id}" not found.`);
        return;
    }

    const navbarHeightRems = 3.75;
    const navbarHeightPixels =
        navbarHeightRems * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const targetElementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const adjustedScrollPosition = targetElementPosition - navbarHeightPixels;

    setTimeout(() => {
        window.scrollTo({
            top: adjustedScrollPosition,
            behavior: 'smooth',
        });
    }, navigator.userAgent.includes('Chrome') && navigator.vendor.includes('Google Inc') ? 0 : 1);
};

const parseDefault = (value, collapse, parentKey, name, handleHashLinkClick, separator) => {

    if (value[0] === '[' && value[value.length - 1] === ']') {
        const items = value.replace("[", "").replace("]", "").split(",").map((item) => {
            return item.trim();
        });
        if (collapse && items.length > 3) {
            items.length = 3;
            items[2] = <i className={"expand-list-text"}>Click to expand</i>;
        }
        return (
            <>
                {separator.replace(/ /g, "")}
                <a className={`config-anchor with-value-active-color hash-link`} href={`#${createUrlHash(parentKey, name)}`} onClick={handleHashLinkClick}></a>
                <div className="indent-2">
                    <div>
                        <ul className={"yaml-list-elem"}>
                            {items.map((item) => {
                                return <li key={item}>{item}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </>
        );
    }
    return (
        <>
            {separator}{value}
            <a className={`config-anchor with-value-active-color hash-link`} href={`#${createUrlHash(parentKey, name)}`} onClick={handleHashLinkClick}></a>
        </>
    );
}

const parseItalics = (key) => {
    if (key.startsWith('<') && key.endsWith('>')) {
        return (
            <>
                <i>{key}</i>
            </>
        )
    }
    return key;
}

const YamlNodeWithDescription = ({ name, node, parentKey, root, separator }) => {
    const [showDescription, setShowDescription] = useState(false);

    node.default = node.default || 'N/A';
    node.description = node.description || 'N/A';

    useEffect(() => {
        const hash = createUrlHash(parentKey, name);
        if (window.location.hash === `#${hash}`) {
            showAndScrollIntoView(hash);
        }
    }, [name]);

    const handleHashLinkClick = (event) => {
        event.preventDefault();
        history.pushState(null, null, event.currentTarget.hash);

        const fullURL = window.location.href.split('#')[0];
        const hash = createUrlHash(parentKey, name);
        navigator.clipboard.writeText(fullURL + '#' + hash);
        scrollIntoView(hash);

        event.stopPropagation();
    };

    const showAndScrollIntoView = (hash) => {
        setShowDescription(true);
        scrollIntoView(hash);
    };

    return (
        <div style={{ paddingLeft: `${root ? 0 : INDENT_SIZE}px` }} id={createUrlHash(parentKey, name)}>
            <div className={`description_word_wrap`} style={{ marginBottom: showDescription ? 10 : 0 }}>
                <a
                    onClick={() => {
                        setShowDescription(!showDescription);
                    }}
                    className={`with-value${showDescription ? '-active' : ''}`}
                >
                    {parseItalics(name)}{parseDefault(node.default.toString(), !showDescription, parentKey, name, handleHashLinkClick, separator)}
                </a>
                {showDescription ? (
                    <>
                        <div className="indent-2" style={{ marginBottom: 10 }}>
                            <div className="outlined-box description-text color-offset-box">
                                <ReactMarkdown className={style.reactMarkDown}>{node.description.toString()}</ReactMarkdown>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

const YamlTreeNode = ({ root, key, parentKey, value, separator }) => {
    const handleClick = (event) => {
        event.preventDefault();
        scrollIntoView(createUrlHash(parentKey, key));
        history.pushState(null, null, `#${createUrlHash(parentKey, key)}`);

        const fullURL = window.location.href.split('#')[0];
        const hash = createUrlHash(parentKey, key);
        navigator.clipboard.writeText(fullURL + '#' + hash);
        scrollIntoView(hash);

        event.stopPropagation();
    };

    const removeTrailingSpaces = (value) => {
        if (value.endsWith(' ')) {
            return removeTrailingSpaces(value.substring(0, value.length - 1));
        }
        return value;
    }

    useEffect(() => {
        const hash = createUrlHash(parentKey, key);
        if (window.location.hash === `#${hash}`) {
            scrollIntoView(hash);
        }
    }, [key]);

    return (
        <div key={key} className={`highlight-config-node`} style={{ paddingLeft: `${root ? 0 : INDENT_SIZE}px` }} id={createUrlHash(parentKey, key)}>
            <div className={`config-auxiliary-node`} style={{display: "inline-flex"}}>
                {parseItalics(key)}{removeTrailingSpaces(separator)}
            </div>
            <a className={`config-anchor with-value-active-color hash-link`} href={`#${createUrlHash(parentKey, key)}`} onClick={handleClick}></a>
            {renderYamlData(value, parentKey ? createUrlHash(parentKey, key) : parseUrlHash(key), false, separator)}
        </div>
    );
};

const renderYamlData = (data, parentKey, root = false, separator) => {
    const renderedNodes = [];

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object') {
            if ('default' in value || 'description' in value) {
                renderedNodes.push(<YamlNodeWithDescription key={key} name={key} parentKey={parentKey} node={value} root={root} separator={separator} />);
            } else {
                renderedNodes.push(YamlTreeNode({ root, key, parentKey, value, separator }));
            }
        }
    }

    return renderedNodes;
};

export default function Config({ data, separator = ': ' }) {
    let ymlData = yaml.load(data);
    return (
        <div>
            <pre style={{ fontVariantLigatures: "no-contextual" }}>{renderYamlData(ymlData, '', true, separator)}</pre>
            <div style={{ display: 'none' }}>{data}</div>
        </div>
    );
}

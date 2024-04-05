import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import style from "@site/src/css/markdown-styles.module.css";
import yaml from "js-yaml";
import VersionFormattedCode from "./VersionFormattedCode";
import Link from "@docusaurus/Link";
import useBrokenLinks from "@docusaurus/core/lib/client/exports/useBrokenLinks";
import Admonition from "@theme/Admonition";
import clsx from "clsx";

const INDENT_SIZE = 30;

const createUrlHash = (parent, name) => {
  return parent + (parent ? "_" : "") + parseUrlHash(name);
};

const parseUrlHash = (name) => {
  return name.replace(/-/g, "_");
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

  setTimeout(
    () => {
      window.scrollTo({
        top: adjustedScrollPosition,
        behavior: "smooth",
      });
    },
    navigator.userAgent.includes("Chrome") && navigator.vendor.includes("Google Inc") ? 0 : 1
  );
};

const parseDefault = (value, collapse, parentKey, name, handleHashLinkClick, separator) => {
  const hash = createUrlHash(parentKey, name);
  useBrokenLinks().collectAnchor(hash);

  if (value[0] === "[" && value[value.length - 1] === "]") {
    const items = value
      .replace("[", "")
      .replace("]", "")
      .split(",")
      .map((item) => {
        return item.trim();
      });
    if (collapse && items.length > 3) {
      items.length = 3;
      items[2] = <i className={"expand-list-text"}>Click to expand</i>;
    }
    return (
      <>
        {separator.replace(/ /g, "")}
        <Link
          className={`config-anchor with-value-active hash-link`}
          href={`#${hash}`}
          onClick={handleHashLinkClick}
        />
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
      {separator}
      {value}
      <Link
        className={`config-anchor with-value-active hash-link`}
        href={`#${hash}`}
        onClick={handleHashLinkClick}
        title={hash}
      />
    </>
  );
};

const parseItalics = (key) => {
  if (key.startsWith("<") && key.endsWith(">")) {
    return (
      <>
        <i>{key}</i>
      </>
    );
  }
  return key;
};

const parseDescriptionForVersioning = (description: String) => {
  return VersionFormattedCode({ children: description, plainText: true });
};

const YamlNodeWithDescription = ({
  name,
  node,
  parentKey,
  root,
  separator,
  showAllDescriptions,
  defaultValue,
}) => {
  const ignoreInitialRenderRef = useRef(false);
  const [showDescription, setShowDescription] = useState(showAllDescriptions);

  node.default = node.default || defaultValue;
  node.description = node.description || "N/A";

  const checkForHash = () => {
    if (typeof window === "undefined") return;
    const hash = createUrlHash(parentKey, name);
    if (window.location.hash === `#${hash}`) {
      showAndScrollIntoView(hash);
    }
  };

  useEffect(() => {
    checkForHash();
  }, [name]);

  if (typeof window !== "undefined") window.addEventListener("hashchange", checkForHash);

  useEffect(() => {
    if (ignoreInitialRenderRef.current) {
      setShowDescription(showAllDescriptions);
    } else {
      ignoreInitialRenderRef.current = true;
    }
  }, [showAllDescriptions]);

  const handleHashLinkClick = (event) => {
    event.preventDefault();
    history.pushState(null, "", event.currentTarget.hash);

    const fullURL = window.location.href.split("#")[0];
    const hash = createUrlHash(parentKey, name);
    navigator.clipboard.writeText(fullURL + "#" + hash);
    scrollIntoView(hash);

    event.stopPropagation();
  };

  const showAndScrollIntoView = (hash) => {
    setShowDescription(true);
    scrollIntoView(hash);
  };

  return (
    <div
      id={createUrlHash(parentKey, name)}
      className={clsx("config-tagged-for-algolia", !root && "config-node-indent-size")}
    >
      <div className={clsx("description_word_wrap", showDescription && "margin-bottom--sm")}>
        <button
          onClick={() => {
            setShowDescription(!showDescription);
          }}
          className={clsx(
            "config-node clean-btn button--link notranslate",
            showDescription && "with-value-active",
            !showDescription && "with-value"
          )}
          translate={"no"}
        >
          {parseItalics(name)}
          {parseDefault(
            node.default.toString(),
            !showDescription,
            parentKey,
            name,
            handleHashLinkClick,
            separator
          )}
        </button>
        <div className={clsx("indent-2", "margin-bottom--sm", !showDescription && "display--none")}>
          <div className="outlined-box description-text color-offset-box">
            <ReactMarkdown className={style.reactMarkDown}>
              {parseDescriptionForVersioning(node.description.toString())}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

const YamlTreeNode = ({
  root,
  name,
  parentKey,
  value,
  separator,
  showAllDescriptions,
  defaultValue,
  warning,
}) => {
  if (name === "inline-docs-warning") return null;

  const handleClick = (event) => {
    event.preventDefault();
    scrollIntoView(createUrlHash(parentKey, name));
    history.pushState(null, "", `#${createUrlHash(parentKey, name)}`);

    const fullURL = window.location.href.split("#")[0];
    const hash = createUrlHash(parentKey, name);
    navigator.clipboard.writeText(fullURL + "#" + hash);
    scrollIntoView(hash);

    event.stopPropagation();
  };

  const removeTrailingSpaces = (value) => {
    if (value.endsWith(" ")) {
      return removeTrailingSpaces(value.substring(0, value.length - 1));
    }
    return value;
  };

  useEffect(() => {
    const hash = createUrlHash(parentKey, name);
    if (window.location.hash === `#${hash}`) {
      scrollIntoView(hash);
    }
  }, [name]);

  const hash = createUrlHash(parentKey, name);
  useBrokenLinks().collectAnchor(hash);

  return (
    <div
      key={name}
      className={clsx("highlight-config-node", !root && "config-node-indent-size")}
      id={hash}
    >
      <div className={"config-auxiliary-node notranslate"} translate={"no"}>
        {parseItalics(name)}
        {removeTrailingSpaces(separator)}
      </div>
      <Link
        className={`config-anchor with-value-active hash-link`}
        href={`#${hash}`}
        onClick={handleClick}
        title={hash}
      />
      {warning && (
        <div className={`inline-admonition-warning`}>
          <Admonition type={"danger"} title={warning.title} children={<p>{warning.message}</p>} />
        </div>
      )}
      {renderYamlData(
        value,
        parentKey ? hash : parseUrlHash(name),
        false,
        separator,
        showAllDescriptions,
        defaultValue
      )}
    </div>
  );
};

const renderYamlData = (
  data,
  parentKey,
  root = false,
  separator,
  showAllDescriptions,
  defaultValue
) => {
  const renderedNodes: JSX.Element[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null) {
      if (
        ("default" in value && typeof value.default !== "object") ||
        ("description" in value && typeof value.description !== "object")
      ) {
        renderedNodes.push(
          <YamlNodeWithDescription
            key={key}
            name={key}
            parentKey={parentKey}
            node={value}
            root={root}
            separator={separator}
            showAllDescriptions={showAllDescriptions}
            defaultValue={defaultValue}
          />
        );
      } else {
        renderedNodes.push(
          <YamlTreeNode
            root={root}
            key={key}
            name={key}
            parentKey={parentKey}
            value={value}
            separator={separator}
            showAllDescriptions={showAllDescriptions}
            defaultValue={defaultValue}
            warning={"inline-docs-warning" in value ? value["inline-docs-warning"] : null}
          />
        );
      }
    }
  }

  return renderedNodes;
};

export default function Config({
  data,
  separator = ": ",
  showDescriptions = false,
  defaultValue = "N/A",
}) {
  const [showAllDescriptions, setShowAllExpanded] = useState(showDescriptions);
  let ymlData = yaml.load(data);
  return (
    <div>
      <pre className="config-container">
        <button
          onClick={() => setShowAllExpanded(!showAllDescriptions)}
          className={`config-button button button--secondary`}
        >
          {showAllDescriptions ? "Collapse All" : "Expand All"}
        </button>
        {renderYamlData(ymlData, "", true, separator, showAllDescriptions, defaultValue)}
      </pre>
    </div>
  );
}

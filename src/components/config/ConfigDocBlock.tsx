import React, { useState, useEffect, useRef, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import style from "@site/src/css/markdown-styles.module.css";
import yaml from "js-yaml";
import VersionFormattedCode from "../versioning/VersionFormattedCode";
import Link from "@docusaurus/Link";
import useBrokenLinks from "@docusaurus/core/lib/client/exports/useBrokenLinks";
import Admonition from "@theme/Admonition";
import clsx from "clsx";

const createUrlHash = (parent: string | number, name: any): string => {
  return parent + (parent ? "_" : "") + parseUrlHash(name);
};

const parseUrlHash = (name: string): string => {
  return name.replace(/-/g, "_");
};

const scrollIntoView = (id: string): void => {
  const targetElement = document.getElementById(id);

  if (!targetElement) {
    console.error(`Element with ID "${id}" not found.`);
    return;
  }

  const navbarHeightRems = 3.75;
  const navbarHeightPixels =
    navbarHeightRems * parseFloat(getComputedStyle(document.documentElement).fontSize);
  const targetElementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
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

const copyAndScroll = (parentKey: string, name: string): void => {
  const fullURL = window.location.href.split("#")[0];
  const hash = createUrlHash(parentKey, name);
  navigator.clipboard.writeText(fullURL + "#" + hash).catch((error) => {
    console.error("Failed to copy to clipboard: ", error);
  });
  scrollIntoView(hash);
};

const parseDefault = (
  value: string,
  collapse: boolean,
  parentKey: string,
  name: string,
  handleHashLinkClick,
  separator: string
): ReactNode => {
  const hash = createUrlHash(parentKey, name);
  useBrokenLinks().collectAnchor(hash);

  if (value[0] === "[" && value[value.length - 1] === "]") {
    const items: (string | ReactNode)[] = value
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
                return <li key={item.toString()}>{item}</li>;
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

const parseItalics = (key: string) => {
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
    copyAndScroll(parentKey, name);
    event.stopPropagation();
  };

  const showAndScrollIntoView = (hash: string) => {
    setShowDescription(true);
    scrollIntoView(hash);
  };

  return (
    <div
      id={createUrlHash(parentKey, name)}
      className={clsx("config-tagged-for-algolia", !root && "config-node-indent-size")}
    >
      <div className={"description_word_wrap"}>
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
        <div className={clsx("indent-2 margin-bottom--sm", !showDescription && "display--none")}>
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
}): ReactNode => {
  if (name === "inline-docs-warning") return null;

  const handleClick = (event) => {
    event.preventDefault();
    scrollIntoView(createUrlHash(parentKey, name));
    history.pushState(null, "", `#${createUrlHash(parentKey, name)}`);
    copyAndScroll(parentKey, name);
    event.stopPropagation();
  };

  const removeTrailingSpaces = (value: string) => {
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
  data: unknown,
  parentKey: string,
  root = false,
  separator: string,
  showAllDescriptions: boolean,
  defaultValue: string
): ReactNode => {
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
}): ReactNode {
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

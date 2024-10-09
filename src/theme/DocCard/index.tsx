import React, { type ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import { findFirstSidebarItemLink, useDocById } from "@docusaurus/plugin-content-docs/client";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { translate } from "@docusaurus/Translate";

import type { Props } from "@theme/DocCard";
import Heading from "@theme/Heading";
import type {
  PropSidebarItemCategory,
  PropSidebarItemHtml,
  PropSidebarItemLink,
} from "@docusaurus/plugin-content-docs";

import styles from "./styles.module.css";
import { Icon } from "@iconify/react";

function CardLayout({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  description?: string;
}): JSX.Element {
  return (
    <Link href={href} className={clsx("padding-horiz--md", styles.cardContainer)}>
      {icon}
      <div className={clsx("padding-left--md")}>
        <Heading
          as="h2"
          className={clsx("margin-bottom--sm", styles.linkBlue, styles.cardTitle)}
          title={title}
        >
          {title}
        </Heading>
        {description && (
          <p className={clsx(styles.cardDescription)} title={description}>
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}

function CardCategory({ item }: { item: PropSidebarItemCategory }): JSX.Element | null {
  const href = findFirstSidebarItemLink(item);

  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }

  return (
    <CardLayout
      href={href}
      icon={
        <Icon
          className={clsx("margin-right--sm", styles.cardIcon)}
          icon="mdi:format-list-bulleted"
          width={24}
        />
      }
      title={item.label}
      description={
        item.description ??
        translate(
          {
            message: "{count} items",
            id: "theme.docs.DocCard.categoryDescription",
            description:
              "The default description for a category card in the generated index about how many items this category includes",
          },
          { count: item.items.length }
        )
      }
    />
  );
}

type EmojiPropsSidebarItemLink = PropSidebarItemLink & {
  customEmoji?: string;
};

function CardLink({ item }: { item: EmojiPropsSidebarItemLink }): JSX.Element {
  const icon = item.customEmoji ? (
    <Icon
      className={clsx("margin-right--sm", styles.cardIcon)}
      icon={item.customEmoji}
      width={24}
    />
  ) : isInternalUrl(item.href) ? (
    <Icon
      className={clsx("margin-right--sm", styles.cardIcon)}
      icon="mdi:paper-outline"
      width={24}
    />
  ) : (
    <Icon
      className={clsx("margin-right--sm", styles.cardIcon)}
      icon="mdi:format-list-bulleted"
      width={24}
    />
  );
  const doc = useDocById(item.docId ?? undefined);
  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={item.description ?? doc?.description}
    />
  );
}

function Header({ item }: { item: PropSidebarItemHtml }): JSX.Element {
  return <h2>{item.value}</h2>;
}

export default function DocCard({ item }: Props): JSX.Element {
  switch (item.type) {
    case "link":
      return <CardLink item={item} />;
    case "category":
      return <CardCategory item={item} />;
    case "html":
      return <Header item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}

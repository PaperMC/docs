import React from "react";
import clsx from "clsx";
import { useCurrentSidebarCategory, filterDocCardListItems } from "@docusaurus/theme-common";
import DocCard from "@theme/DocCard";
import type { Props } from "@theme/DocCardList";

function DocCardListForCurrentSidebarCategory({ className }: Props) {
  const category = useCurrentSidebarCategory();
  return <DocCardList items={category.items} className={className} />;
}

export default function DocCardList(props: Props): JSX.Element {
  const { items, className } = props;
  if (!items) {
    return <DocCardListForCurrentSidebarCategory {...props} />;
  }
  const filteredItems = filterDocCardListItems(items);
  return (
    <section>
      {filteredItems.map((item, index) => (
        <article key={index} className="margin-bottom--lg">
          <DocCard item={item} />
        </article>
      ))}
    </section>
  );
}

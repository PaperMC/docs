import React, { ComponentProps } from "react";
import type DocVersionBadgeType from "@theme/DocVersionBadge";

type Props = ComponentProps<typeof DocVersionBadgeType>;

// Fully remove version badge. this is ugly. Warning banner stays
export default function DocVersionBadgeWrapper(_props: Props): JSX.Element {
  return <>{/*<DocVersionBadge {...props} />*/}</>;
}

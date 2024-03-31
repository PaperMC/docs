import React from "react";
import clsx from "clsx";
import useIsBrowser from "@docusaurus/useIsBrowser";
import type { Props } from "@theme/ColorModeToggle";

import styles from "./styles.module.css";
import { Icon } from "@iconify/react";

function FoolsModeToggle({ className, buttonClassName, value, onChange }: Props): JSX.Element {
  const isBrowser = useIsBrowser();

  const title = "Switch between April Fools and Normal mode";

  // Check to see if it is April Fools Day
  const today = new Date();
  const isAprilFools =
    today >= new Date(today.getFullYear(), 3, 1) && today < new Date(today.getFullYear(), 3, 2);

  if (!isAprilFools) {
    return null;
  }

  return (
    <div className={clsx(styles.toggle, className)}>
      <button
        className={clsx(
          "clean-btn",
          styles.toggleButton,
          !isBrowser && styles.toggleButtonDisabled,
          buttonClassName
        )}
        type="button"
        onClick={() => onChange(value === "dark" ? "light" : "dark")}
        disabled={!isBrowser}
        title={title}
        aria-label={title}
        aria-live="polite"
      >
        <Icon
          icon={"mdi:theatre"}
          className={styles.toggleIcon}
          style={{ height: 24, width: 24 }}
        />
      </button>
    </div>
  );
}

export default React.memo(FoolsModeToggle);

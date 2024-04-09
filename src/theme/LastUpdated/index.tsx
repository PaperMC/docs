import React, { useEffect, useState } from "react";
import Translate from "@docusaurus/Translate";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDateTimeFormat, useDoc } from "@docusaurus/theme-common/internal";
import type { Props } from "@theme/LastUpdated";
import Link from "@docusaurus/Link";
import { GitHubCommit } from "@site/src/util/GitHubStuff";

const usernameCache: Map<string, string> = new Map();

function LastUpdatedAtDate({ lastUpdatedAt }: { lastUpdatedAt: number }): JSX.Element {
  const atDate = new Date(lastUpdatedAt);

  const dateTimeFormat = useDateTimeFormat({
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const formattedLastUpdatedAt = dateTimeFormat.format(atDate);

  return (
    <Translate
      id="theme.lastUpdated.atDate"
      description="The words used to describe on which date a page has been last updated"
      values={{
        date: (
          <b>
            <time dateTime={atDate.toISOString()} itemProp="dateModified">
              {formattedLastUpdatedAt}
            </time>
          </b>
        ),
      }}
    >
      {" on {date}"}
    </Translate>
  );
}

function LastUpdatedByUser({
  lastUpdatedBy,
  commit,
}: {
  lastUpdatedBy: string;
  commit: string;
}): JSX.Element {
  let usernameFromCache = usernameCache.get(commit);
  const [username, setUsername] = useState(usernameFromCache ?? "ghost");

  if (process.env.NODE_ENV !== "development") {
    useEffect(() => {
      const run = async () => {
        try {
          console.log(
            `[${usernameCache.size}] "${commit}" -> "${username} (${usernameCache.get(commit)})"`
          );
          if (usernameFromCache === undefined) {
            // probably need to handle rate limit or sum
            const response1 = await fetch(`https://api.github.com/repos/PaperMC/docs/commits/${commit}`, {
              headers: {
                Accept: "application/vnd.github.v3+json",
                // `X-GitHub-Api-Version`: "2022-11-28", // ???
              },
            });

            const data = await response1.json() as GitHubCommit;


            usernameCache.set(commit, data.author.login);
            // usernameCache.set(commit, commitResponse.data.author.login);
            console.log(
              `[${usernameCache.size}] ${commit} -> ${username} (${response1.headers["x-ratelimit-remaining"]}/${response1.headers["x-ratelimit-limit"]})`
            );
            setUsername(data.author.login);
          }
        } catch (error) {
          // silent
          console.error(error);
        }
      };

      run();
    }, []);
  }

  return (
    <Translate
      id="theme.lastUpdated.byUser"
      description="The words used to describe by who the page has been last updated"
      values={{
        user: (
          <b>
            <Link to={"https://github.com/" + username}>{lastUpdatedBy}</Link>
          </b>
        ),
      }}
    >
      {" by {user}"}
    </Translate>
  );
}

function LastCommitIn({ lastCommitIn }: { lastCommitIn: string }): JSX.Element {
  return (
    <Translate
      id="theme.lastUpdated.inCommit"
      description="The words used to describe in what commit was used"
      values={{
        commit: (
          <b>
            <Link to={"https://github.com/PaperMC/docs/commit/" + lastCommitIn}>
              {lastCommitIn}
            </Link>
          </b>
        ),
      }}
    >
      {" in {commit}"}
    </Translate>
  );
}

export default function LastUpdated({ lastUpdatedAt, lastUpdatedBy }: Props): JSX.Element {
  const doc = useDoc();

  const author = (doc.frontMatter as any).author as {
    commit: string;
  };

  return (
    <span className={ThemeClassNames.common.lastUpdated}>
      <Translate
        id="theme.lastUpdated.lastUpdatedAtBy"
        description="The sentence used to display when a page has been last updated, and by who"
        values={{
          atDate: lastUpdatedAt ? <LastUpdatedAtDate lastUpdatedAt={lastUpdatedAt} /> : "",
          byUser: lastUpdatedBy ? (
            <LastUpdatedByUser lastUpdatedBy={lastUpdatedBy} commit={author.commit} />
          ) : (
            ""
          ),
          inCommit: <LastCommitIn lastCommitIn={author.commit} />,
        }}
      >
        {"Last updated{atDate}{byUser}{inCommit}"}
      </Translate>
      {process.env.NODE_ENV === "development" && (
        <div>
          {/* eslint-disable-next-line @docusaurus/no-untranslated-text */}
          <small> (Simulated during dev for better perf)</small>
        </div>
      )}
    </span>
  );
}

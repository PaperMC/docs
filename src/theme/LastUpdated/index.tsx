import React, { useEffect, useState } from "react";
import Translate from "@docusaurus/Translate";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDateTimeFormat, useDoc } from "@docusaurus/theme-common/internal";
import type { Props } from "@theme/LastUpdated";
import Link from "@docusaurus/Link";
import { Octokit } from "@octokit/rest";

const usernameCache: Map<string, string> = new Map();
const octokit = new Octokit({
  userAgent: "PaperMC-Docs",
  // auth: "GITHUB_TOKEN",
});

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
            const commitResponse = await octokit.repos.getCommit({
              owner: "PaperMC",
              repo: "docs",
              ref: commit,
            });

            usernameCache.set(commit, commitResponse.data.author.login);
            console.log(
              `[${usernameCache.size}] ${commit} -> ${username} (${commitResponse.headers["x-ratelimit-remaining"]}/${commitResponse.headers["x-ratelimit-limit"]})`
            );
            setUsername(commitResponse.data.author.login);
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

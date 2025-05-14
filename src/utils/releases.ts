import { resolve } from "node:path/posix";

interface Release {
  name: string;
  body: string;
  published: string;
  url: string;
  tag: string;
}

const token = process.env.GITHUB_TOKEN;

const options: RequestInit = token
  ? {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "papermc-docs/author",
        Authorization: `Bearer ${token}`,
      },
    }
  : {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "papermc-docs/author",
      },
    };

const cache: Map<string, Release[]> = new Map();

export async function fetchRelease(repo: string): Promise<Release[]> {
  const cached = cache.get(repo);
  if (cached != null) {
    return cached;
  }

  const json = (await fetch(`https://api.github.com/repos/${repo}/releases`, options).then((r) =>
    r.ok ? r.json() : [{}]
  )) as any[];

  const out: Release[] = json
    .map<Release>((obj) => {
      return {
        name: obj.name ?? "<unknown-name>",
        body: obj.body ?? "<unknown-body>",
        published: obj.published_at ?? "2000-01-01",
        url: obj.html_url ?? "about:blank",
        tag: obj.tag_name?.replaceAll(".", "-") ?? "none",
      };
    })
    // Post-processing
    .map((obj) => {
      // Link contributors
      {
        const alreadyMatched: string[] = [];
        obj.body
          .matchAll(/\@(\w|\d|\-)+/g)
          .map((match) => match[0])
          .forEach((match) => {
            if (alreadyMatched.find((e) => e == match) != null) {
              return;
            }

            obj.body = obj.body.replaceAll(match, `[${match}](https://github.com/${match.substring(1)})`);
            alreadyMatched.push(match);
          });
      }
      {
        const alreadyMatched: string[] = [];
        obj.body
          .matchAll(/https\:\/\/github\.com\/\w+\/\w+\/pull\/\d+/g)
          .map((match) => match[0])
          .forEach((match) => {
            if (alreadyMatched.find((e) => e == match) != null) {
              return;
            }

            const split: string[] = match.split("/");

            obj.body = obj.body.replaceAll(match, `[#${split[split.length - 1]}](${match})`);
            alreadyMatched.push(match);
          });
      }
      {
        const alreadyMatched: string[] = [];
        obj.body
          .matchAll(/https\:\/\/github\.com\/\w+\/\w+\/compare\/[v\.\d]+/g)
          .map((match) => match[0])
          .forEach((match) => {
            if (alreadyMatched.find((e) => e == match) != null) {
              return;
            }

            const split: string[] = match.split("/");

            obj.body = obj.body.replaceAll(match, `[${split[split.length - 1]}](${match})`);
            alreadyMatched.push(match);
          });
      }

      Object.entries({
        bug: "🐛",
        older_adult: "🧓",
        wrench: "🔧",
        cake: "🍰",
        sparkle: "✨",
        tokyo_tower: "🗼",
      }).forEach((v) => {
        obj.body = obj.body.replaceAll(`:${v[0]}:`, v[1]);
      });

      return obj;
    });

  cache.set(repo, out);
  return out;
}

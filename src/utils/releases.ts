export interface Release {
  name: string;
  body: string;
  published: string;
  url: string;
  tag: string;
  tag_name: string;
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
        tag_name: obj.tag_name ?? "v1.0.0",
      };
    })
    // Post-processing
    .map((obj) => {
      handleRegex(obj, /\@(\w|\d|\-)+/g, (match) => `[${match}](https://github.com/${match.substring(1)})`);
      handleRegex(obj, /https\:\/\/github\.com\/\w+\/\w+\/pull\/\d+/g, shortCut);
      handleRegex(obj, /https\:\/\/github\.com\/\w+\/\w+\/compare\/[v\.\d]+/g, shortCut);
      return obj;
    })
    .map((obj) => {
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

function handleRegex(obj: Release, regex: RegExp, onMatch: (match: string) => string) {
  if (obj.body == null || obj.body.matchAll == null) {
    console.warn("obj.body is null. Not resolving any further.");
    return;
  }

  const alreadyMatched: string[] = [];
  obj.body
    .matchAll(regex)
    .map((match) => match[0])
    .forEach((match) => {
      if (alreadyMatched.find((e) => e == match) != null) {
        return;
      }

      obj.body = obj.body.replaceAll(match, onMatch(match));
      alreadyMatched.push(match);
    });
}

function shortCut(match: string): string {
  const split: string[] = match.split("/");
  return `[${split[split.length - 1]}](${match})`;
}

interface Release {
  name: string;
  body: string;
  published: string;
  url: string;
  tag: string;
}

const cache: Map<string, Release[]> = new Map();

export async function fetchRelease(repo: string): Promise<Release[]> {
  const cached = cache.get(repo);
  if (cached != null) {
    return cached;
  }

  const json = (await fetch(`https://api.github.com/repos/${repo}/releases`).then((response) =>
    response.json()
  )) as any[];

  const out: Release[] = json
    .map<Release>((obj) => {
      return {
        name: obj.name,
        body: obj.body,
        published: obj.published_at,
        url: obj.html_url,
        tag: obj.tag_name.replaceAll(".", "-"),
      };
    })
    // Post-processing
    .map((obj) => {
      // Link contributors
      {
        const alreadyMatched: string[] = [];
        obj.body
          .matchAll(/\@(\w|\d)+/g)
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

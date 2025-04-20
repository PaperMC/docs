import { execSync } from "child_process";

export interface GitHubAccount {
  displayName: string;
  email: string;
  accountLink?: string;
}

const headers = {
  headers: {
    Accept: "application/vnd.github+json",
    "User-Agent": "papermc-docs/author",
  },
};

const repo: string = "PaperMC/docs";
const cache: Map<string, GitHubAccount> = new Map();

// Git
export async function getGitHubAccountFromFile(filePath: string): Promise<GitHubAccount | null> {
  const displayName = execSync(`git log -1 --pretty="format:%an" -- "${filePath}"`).toString();
  const email = execSync(`git log -1 --pretty="format:%ae" -- "${filePath}"`).toString();

  const cached = cache.get(email);
  if (cached != null) {
    cached.displayName = displayName;
    return cached;
  }

  const accLink = await getGitHubAccountLinkByEmail(email);
  if (accLink != null) {
    const acc: GitHubAccount = {
      displayName: displayName,
      email: email,
      accountLink: accLink,
    };
    cache.set(email, acc);
    return acc;
  }

  // As the email seems to not be directly linked to an account, we instead use the GitHub API
  const url = new URL(`https://api.github.com/repos/${repo}/commits`);
  url.searchParams.set("path", filePath);
  url.searchParams.set("per_page", "1");

  // It is **KNOWN** that if a commit is not pushed to GitHub, the link will be of the person who last edited the page remotely.
  // This is only a bug in local dev or other branch environments, and not in production.
  const commit = (await fetch(url, headers).then((response) => response.json()))[0];
  let acc: GitHubAccount = {
    displayName: displayName,
    email: email,
    accountLink: commit?.author?.html_url,
  };

  cache.set(email, acc);
  return acc;
}

// E-Mail related

export async function getGitHubAccountLinkByEmail(email: string): Promise<string | null> {
  const url = new URL(`https://api.github.com/search/users?q=${email}`);
  const result = await fetch(url, headers).then((response) => response.json());

  if (result?.items == null || result.items.length < 1) {
    return null;
  }

  const item = result.items[0];
  return item.html_url;
}

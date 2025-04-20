import { execSync } from "child_process";

export interface GitHubAccount {
  displayName: string;
  email: string;
  accountLink?: string;
}

const token: string | null = import.meta.env.GITHUB_TOKEN;

const headers: RequestInit =
  token != null
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

const repo: string = "PaperMC/docs";
const emailCache: Map<string, GitHubAccount> = new Map();

// Git
export async function getGitHubAccountFromFile(filePath: string): Promise<GitHubAccount | null> {
  const email = execSync(`git log -1 --pretty="format:%ae" -- "${filePath}"`).toString();
  const cached = emailCache.get(email);
  if (cached != null) {
    return cached;
  }

  const displayName = execSync(`git log -1 --pretty="format:%an" -- "${filePath}"`).toString();
  const hash = execSync(`git log -1 --pretty="format:%H" -- "${filePath}"`).toString();

  // As the email seems to not be directly linked to an account, we instead use the GitHub API
  const url = new URL(`https://api.github.com/repos/${repo}/commits/${hash}`);
  url.searchParams.set("per_page", "1");

  let commit = await fetch(url, headers).then((response) => response.json());
  let acc: GitHubAccount = {
    displayName: commit.commit?.author?.name ?? displayName,
    email: email,
    accountLink: commit?.author?.html_url,
  };

  emailCache.set(email, acc);
  return acc;
}

import fs from "fs-extra";
import path from "path";
import { Endpoints } from "@octokit/types";
import axios, { AxiosError } from "axios";

import { getFileCommitHash } from "@docusaurus/utils/src/gitUtils";
import { Globby } from "@docusaurus/utils/src/globUtils";

type endpoint = Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"];
let axiosInstance = axios.create({
  baseURL: "https://api.github.com/repos/PaperMC/docs/commits/",
  headers: {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "PaperMC-Docs",
  },
});

let total = 0;
let count = 0;

// process.env.GITHUB_TOKEN = "";

if (process.env.GITHUB_TOKEN !== undefined) {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

export type AuthorData = {
  username: string;
  commit: string;
};

export const AUTHOR_FALLBACK: AuthorData = {
  commit: "1b3d5f7",
  username: "ghost",
};

export const commitCache: Map<string, string> = new Map();

async function cacheUsernameFromCommit(commit: string) {
  console.log(commit);
  try {
    const response = (await axiosInstance.get(commit)) as endpoint["response"];
    const username = response.data.author.login;

    console.log(
      `[${commitCache.size}] ${commit} -> ${response.data.author.login} (${response.headers["x-ratelimit-remaining"]}/${response.headers["x-ratelimit-limit"]}) { hits: ${++total} } { ping: ${++count} }`
    );
    commitCache.set(commit, username);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      error as AxiosError;
      console.error(error.response?.data ?? error.response);
    } else {
      // silent
      console.error(error);
    }
  }
}

export async function processing() {
  const docPath = path.resolve("docs/");

  if (!(await fs.pathExists(docPath))) {
    return null;
  }

  const pagesFiles = await Globby("docs/**/*.md*");
  // console.log(pagesFiles);

  console.log(`1: commitCache size: ${commitCache.size}`);

  const commits = await Promise.all(pagesFiles.map(getFileCommitHash));
  const commitsSet = new Set(commits.map((value) => value.commit));
  console.log(`2: commitsSet size: ${commitsSet.size}`);

  await Promise.all(Array.from(commitsSet).map(cacheUsernameFromCommit));

  console.log(`3: commitCache size: ${commitCache.size}`);
}

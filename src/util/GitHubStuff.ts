export interface Committer {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Author {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Tree {
  url: string;
  sha: string;
}

export interface Verification {
  verified: boolean;
  reason: string;
  signature: string | null;
  payload: string | null;
}

export interface Commit {
  url: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: Committer;
  message: string;
  tree: Tree;
  comment_count: number;
  verification: Verification;
}

export interface Parent {
  url: string;
  sha: string;
}

export interface Stats {
  additions: number;
  deletions: number;
  total: number;
}

export interface File {
  filename: string;
  additions: number;
  deletions: number;
  changes: number;
  status: string;
  raw_url: string;
  blob_url: string;
  patch: string;
}

export interface GitHubCommit {
  url: string;
  sha: string;
  node_id: string;
  html_url: string;
  comments_url: string;
  commit: Commit;
  author: Author;
  committer: Committer;
  parents: Parent[];
  stats: Stats;
  files: File[];
}

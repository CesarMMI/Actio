export type Config = {
  vault_path: string;   // absolute path to vault folder (RN-087)
  app_version: string;  // semver
  last_opened_at?: string;
};

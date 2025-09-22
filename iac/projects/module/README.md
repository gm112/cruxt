# terraform-project-module

This module deploys a project to a cloud provider. Given a github repository url and branch, it will deploy the project to the cloud provider. It will also create a database if the database type is specified, currently only PostgreSQL is supported.

## Inputs

### `project_name`

**Required:** `true`

**Type:** `string`

The name of the project to deploy.

### `project_repository_url`

**Required:** `true`

**Type:** `string`

The URL of the repository to deploy.

### `project_environments`

**Required:** `true`

**Type:** `list(string)`

**Values:** `development`, `staging`, `production`

**Default:** `["development"]`

The environment to deploy to.

### `project_tags`

**Required:** `false`

**Type:** `list(string)`

**Default:** `[]`

The tags to apply to the project.

### `project_database_type`

**Required:** `false`

**Type:** `string`

**Values:** `postgresql`, `none`

**Default:** `none`

The type of database to use.

### `project_env_vars`

**Required:** `false`

**Type:** `map(string)`

Environment variables to set.

### `project_cloud_provider`

**Required:** `true`

**Type:** `string`

**Values:** `deno-deploy`, `linode-standalone`, `aws-amplify`, `cloudflare-pages`

The cloud provider to use.

Currently only `linode-standalone` is works, the rest are in development still.

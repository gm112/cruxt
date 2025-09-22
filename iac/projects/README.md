# Terraform Projects Workspace

This workspace manages the infrastructure for the projects in this pnpm workspace. It is setup to make it easy to deploy a project to a cloud provider, to manage different deployment environments and to migrate to different cloud providers.

## Usage

To deploy a project, add a new entry to the `projects` variable in `terraform.tfvars`. The entry should be a map with the following keys:

- `name`: The name of the project to deploy.
- `repository_url`: The URL of the repository to deploy. If not set, the `GITHUB_REPOSITORY_URL` environment variable will be used as a fallback.
- `environments`: The environments to deploy to.
- `tags`: The tags to apply to the project.
- `database_type`: The type of database to use.
- `env_vars`: Environment variables to set.
- `cloud_provider`: The cloud provider to use.

For a more detailed description of each key, see the [module README](../module/README.md). Please refer to the Cloud Providers section for more information on the cloud providers in the [module README](../module/README.md).

For example:

```terraform
projects = {
  "nuxt-v4-mobile-app-with-auth" = {
    name              = "nuxt-v4-mobile-app-with-auth"
    repository_url    = "https://github.com/gm112/cruxt"
    environments      = ["development"]
    tags              = ["internal"]
    database_type     = "postgresql"
    env_vars          = {}
    cloud_provider    = "deno-deploy"
  }
}
```

or

```terraform
projects = {
  "nuxt-v4-mobile-app-with-auth" = {
    name           = "nuxt-v4-mobile-app-with-auth"
    environments   = ["development"]
    tags           = ["internal"]
    database_type  = "postgresql"
    env_vars       = {}
    cloud_provider = "linode-standalone"
  }
}

github_repository_url = "https://github.com/gm112/cruxt"
```

## Inputs

### `projects`

**Required:** `true`

**Type:** `map(object({ name = string, repository_url = string, environments = list(string), tags = list(string), database_type = string, env_vars = map(string), cloud_provider = string }))`

The projects to deploy.

## Environment Variables

### `GITHUB_REPOSITORY_URL`

**Required:** `true`

**Type:** `string`

The URL of the repository to deploy. Used as a fallback if `project_repository_url` is not set.

### `LINODE_TOKEN`

**Required:** `false`

**Type:** `string`

The Linode API token.

### `CLOUDFLARE_API_TOKEN`

**Required:** `false`

**Type:** `string`

The Cloudflare API token.

## [apps.tf](./apps.tf) - Terraform Entrypoint

This file is the entrypoint for the terraform workspace, it reads the `projects` variable and creates a module for each project.

## Developemnt Notes/Ideas/TODO

- [ ] Add a script that can scan the .tfvars and the `git_repository_url` and automatically generate the `projects` variable.
- [ ] Update it so that the projects themselves can configure the deployments, so the script that scans the folders can manage the .tfvars without input from a user.
- [ ] Add docker support to the nuxt project. We can use this to create a standalone provider that deploys to a kubernetes cluster, for an on-prem or custom cloud deployment.

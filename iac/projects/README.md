# Terraform Projects Workspace

This workspace manages the infrastructure for the projects in this pnpm workspace. It is setup to make it easy to deploy a project to a cloud provider, to manage different deployment environments and to migrate to different cloud providers.

## Usage

To deploy a project, add a new entry to the `projects` variable in `terraform.tfvars`. The entry should be a map with the following keys:

- `name`: The name of the project to deploy.
- `repository_url`: The URL of the repository to deploy.
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

## Inputs

### `projects`

**Required:** `true`

**Type:** `map(object({ name = string, repository_url = string, environments = list(string), tags = list(string), database_type = string, env_vars = map(string), cloud_provider = string }))`

The projects to deploy.

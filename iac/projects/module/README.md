# terraform-project-module

This module deploys a project to a cloud provider. Given a github repository url and branch, it will deploy the project to the cloud provider. It will also create a database if the database type is specified, currently only PostgreSQL is supported. This module is used by the [Projects Workspace](../README.md) to abstract the deployment of projects.

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

**Values:** `postgresql`, `supabase`, `none`

**Default:** `none`

The type of database to use.

### `project_env_vars`

**Required:** `false`

**Type:** `map(string)`

Environment variables to set.

### `project_cloud_provider`

**Required:** `true`

**Type:** `string`

**Values:** `deno-deploy`, `linode-standalone`, `kubernetes-k8s`, `aws-amplify`, `cloudflare-pages`

The cloud provider to use.

## Adding a new postgres provider

1. Create a new directory in `cloud-environments/postgres/new-provider` with the name of the provider.
2. Update [inputs.tf](./inputs.tf) to add the new provider to the `project_database_type` variable so that it is validated correctly.
3. Update [locals.tf](./locals.tf) to add the new provider to the `provider_supported_database_types` map.
4. Update each cloud provider to support the new provider. See the implementation in [linode-standalone](../../cloud-environments/nuxt/linode-standalone/database.tf) for an example.
5. Update the [README.md](./README.md) to add the new provider to the list of supported providers.

## Adding a new cloud provider

1. Create a new directory in `cloud-environments/new-provider` with the name of the provider.
2. Update [inputs.tf](./inputs.tf) to add the new provider to the `project_cloud_provider` variable so that it is validated correctly.
3. Update [locals.tf](./locals.tf) to add the new provider to the `provider_supported_database_types` map.
4. Create a new `inputs.tf` file in the new provider directory with the same name as the provider.

   ```terraform
   variable "project_name" {
     type        = string
     description = "The name of the project to deploy."
   }

   # May not need this if the provider does not support multiple environments (see [linode's postgres](../../cloud-environments//postgres//linode/database.tf) and its usage in [linode-standalone](../../cloud-environments/nuxt/linode-standalone/database.tf) for an example).
   
   variable "project_environments" {
     type        = list(string)
     description = "The environments to deploy to."
     default     = ["development"]

     validation {
       condition     = contains(["development", "staging", "production"], var.project_environment)
       error_message = "Environment must be one of: development, staging, production."
     }
   }

   variable "project_tags" {
     type        = list(string)
     description = "The tags to apply to the project."
     default     = []
   }
   ```

5. Add each database type to the new provider that you want to support. See the implementation in [linode-standalone](../../cloud-environments/nuxt/linode-standalone/database.tf) for an example.
6. Update the [README.md](./README.md) to add the new provider to the list of supported providers.

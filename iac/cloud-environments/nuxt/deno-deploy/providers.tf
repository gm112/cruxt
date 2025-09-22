terraform {
  required_version = ">= 1.13.0"
  required_providers {
    deno = {
      source  = "denoland/deno"
      version = "0.1.0"
    }
  }
}

provider "deno" {
  # # Put your token here.
  # # If omitted, the token will be read from the environment variable `DENO_DEPLOY_TOKEN`.
  # token = var.deno_deploy_api_token

  # # Organization ID that this provider will interact with.
  # # If omitted, the organization ID will be read from the environment variable `DENO_DEPLOY_ORGANIZATION_ID`.
  # organization_id = var.deno_deploy_organization_id
}

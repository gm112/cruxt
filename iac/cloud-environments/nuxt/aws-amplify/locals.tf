
locals {
  # Base tags applied to all environments
  base_tags = ["terraform", "github"]

  # Tags unique to each environment
  environment_tags = {
    production  = ["critical", "24x7"]
    staging     = ["testing", "internal"]
    development = ["dev", "internal"]
  }

  # Default regions
  default_regions = ["us-east-1"]

  # Regions per environment
  environment_regions = {
    production  = merge(local.default_regions, ["us-east-2"])
    staging     = local.default_regions
    development = local.default_regions
  }

  # Compute project tags per environment
  project_environment_tags = {
    for env in var.project_environments :
    env => concat(var.project_tags, local.base_tags, lookup(local.environment_tags, env, []))
  }

  # Compute regions per environment
  project_environment_regions = {
    for env in var.project_environments :
    env => lookup(local.environment_regions, env, local.default_regions)
  }

  aws_region_availability_zones = {
    "production"  = ["us-east-1a", "us-east-1b", "us-east-2a", "us-east-2b"]
    "staging"     = ["us-east-1a", "us-east-1b"]
    "development" = ["us-east-1a", "us-east-1b"]
  }


  github_repository_url = "https://${length(github_terraform_module_repository_personal_access_token) > 0 ? "${github_terraform_module_repository_personal_access_token}@" : ""}github.com/gm112/cruxt.git"
  github_ref            = "main"
}

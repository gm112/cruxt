locals {
  branch_environment_map = {
    "main"      = "production"
    "staging"   = "staging"
    "develop"   = "development"
    "feature/*" = "development"
  }

  # Map environment to branch
  environment_branch_map = {
    production  = "main"
    staging     = "staging"
    development = "develop"
  }

  # Base and per-environment tags
  base_tags = ["terraform", "git"]

  environment_tags = {
    production  = ["critical", "24x7"]
    staging     = ["testing", "internal"]
    development = ["dev", "internal"]
  }

  # Compute tags per environment
  project_environment_tags = {
    for env in var.project_environments :
    env => concat(
      var.project_tags,
      local.base_tags,
      lookup(local.environment_tags, env, [])
    )
  }

  # Compute branch for each environment
  project_environment_branches = {
    for env in var.project_environments :
    env => lookup(local.environment_branch_map, env, "develop")
  }
}

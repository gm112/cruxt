# Documentation can be found at file://./README.md
module "app" {
  for_each                  = var.projects
  # Documentation can be found at file://./module/README.md
  source                    = "../module"
  project_name              = each.value.name
  project_repository_url    = each.value.repository_url ? each.value.repository_url : var.github_repository_url
  project_repository_branch = var.github_branch
  project_cloud_provider    = each.value.cloud_provider
  project_environments      = each.value.environments
  project_tags              = each.value.tags
  project_database_type     = each.value.database_type
  project_env_vars          = each.value.env_vars
}

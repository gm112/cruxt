module "project_deployment_environment" {
  for_each                  = toset(var.project_environments)
  source                    = "../cloud-environments/${var.project_cloud_provider}"
  project_environment       = each.key
  project_name              = var.project_name
  project_repository_url    = var.project_repository_url
  project_repository_branch = local.project_environment_branches[each.key]
  project_tags              = local.project_environment_tags[each.key]
  project_database_type     = var.project_database_type
  project_env_vars          = var.project_env_vars
}

module "standalone_database" {
  for_each = toset(var.project_database_type == "postgresql" ? var.project_environments : [])
  source   = var.source_terraform_modules_from_local ? "../../postgres/linode" : "git::${local.github_repository_url}/iac/cloud-environments/postgres/linode?ref=${local.github_ref}"
  label    = "${var.project_name}-${each.key}"
  region   = local.project_environment_regions[each.key]
  type     = "g6-nanode-1"
}

module "supabase_database" {
  for_each                 = toset(var.project_database_type == "supabase" ? var.project_environments : [])
  source                   = var.source_terraform_modules_from_local ? "../../postgres/supabase" : "git::${local.github_repository_url}/iac/cloud-environments/postgres/supabase?ref=${local.github_ref}"
  project_name             = var.project_name
  supabase_access_token    = env("SUPABASE_ACCESS_TOKEN")
  supabase_organization_id = env("SUPABASE_ORGANIZATION_ID")
}

module "k8s_database" {
  for_each = toset(var.project_database_type == "postgresql" ? var.project_environments : [])
  source   = var.source_terraform_modules_from_local ? "../../postgres/kubernetes-k8s" : "git::${local.github_repository_url}/iac/cloud-environments/postgres/kubernetes-k8s?ref=${local.github_ref}"

  project_name = var.project_name
  username     = "postgres"
  db_name      = "${var.project_name}-${each.key}"

  port            = 5432
  kubernetes_host = ""
}

module "supabase_database" {
  for_each = toset(var.project_database_type == "supabase" ? var.project_environments : [])
  source   = var.source_terraform_modules_from_local ? "../../postgres/supabase" : "git::${local.github_repository_url}/iac/cloud-environments/postgres/supabase?ref=${local.github_ref}"

  project_name = var.project_name

  supabase_access_token    = env("SUPABASE_ACCESS_TOKEN")
  supabase_organization_id = env("SUPABASE_ORGANIZATION_ID")
}

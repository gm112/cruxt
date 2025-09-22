module "k8s_database" {
  for_each = toset(var.project_database_type == "postgresql" ? var.project_environments : [])
  source   = "../../postgres/kubernetes-k8s"

  project_name = var.project_name
  username     = "postgres"
  db_name      = "${var.project_name}-${each.key}"

  port            = 5432
  kubernetes_host = ""
}

module "supabase_database" {
  for_each = toset(var.project_database_type == "supabase" ? var.project_environments : [])
  source   = "../../postgres/supabase"

  project_name = var.project_name

  supabase_access_token    = env("SUPABASE_ACCESS_TOKEN")
  supabase_organization_id = env("SUPABASE_ORGANIZATION_ID")
}

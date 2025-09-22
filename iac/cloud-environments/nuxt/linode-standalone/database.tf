module "standalone_database" {
  for_each = toset(var.project_environments)
  count    = var.project_database_type == "postgresql" ? 1 : 0
  source   = "../../postgres/linode"
  label    = "${var.project_name}-${each.key}"
  region   = local.project_environment_regions[each.key]
  type     = "g6-nanode-1"
}

module "supabase_database" {
  for_each     = toset(var.project_environments)
  count        = var.project_database_type == "supabase" ? 1 : 0
  source       = "../../postgres/supabase"
  project_name = var.project_name
}

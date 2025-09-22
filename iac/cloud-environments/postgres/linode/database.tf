resource "random_password" "project_database_password" {
  length  = 32
  special = true
}

resource "linode_database_postgresql_v2" "project_database" {
  label         = var.label
  engine_id     = var.engine_id
  region        = var.region
  type          = var.type
  root_password = random_password.project_database_password[count.index].result
}

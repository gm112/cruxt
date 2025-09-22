output "instance_labels" {
  value = [for i in linode_instance.project_instance : i.label]
}

output "instance_ips" {
  value = [for i in linode_instance.project_instance : i.ipv4[0]]
}

output "db_hostnames" {
  value = var.project_database_type == "postgresql" ? [for db in linode_database_postgresql_v2.project_database : db.hostname] : []
}

output "db_passwords" {
  value = var.project_database_type == "postgresql" ? [for p in random_password.project_database_password : p.result] : []
}

resource "linode_image" "project_image" {
  for_each = { for env in var.project_environments :
  env => local.project_environment_regions[env] }

  region      = each.value[0]
  label       = "${var.project_name}-${each.key}-image"
  description = "Docker image for ${var.project_name} (${each.key})"
  file_path   = local.project_environment_docker_paths[each.key]
  file_hash   = filemd5(local.project_environment_docker_paths[each.key])
  tags        = local.project_environment_tags[each.key]

  replica_regions = each.value
}

resource "linode_instance" "project_instance" {
  for_each = { for env in var.project_environments : env => local.project_environment_regions[env] }

  count  = length(each.value)
  region = each.value[count.index]
  label  = "${var.project_name}-${each.key}-${each.value[count.index]}"
  image  = linode_image.project_image[each.key].id
  type   = "g6-standard-1"
  tags   = local.project_environment_tags[each.key]
}

resource "random_password" "project_database_password" {
  count   = var.project_database_type == "postgresql" ? length(var.project_environments) : 0
  length  = 32
  special = true
}

resource "linode_database_postgresql_v2" "project_database" {
  count         = var.project_database_type == "postgresql" ? length(var.project_environments) : 0
  label         = "${var.project_name}-${var.project_environments[count.index]}"
  engine_id     = "postgresql/16"
  region        = "us-mia"
  type          = "g6-nanode-1"
  root_password = random_password.project_database_password[count.index].result
}

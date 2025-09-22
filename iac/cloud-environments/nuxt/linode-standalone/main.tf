resource "docker_image" "project_image" {
  for_each = { for env in var.project_environments :
  env => local.project_environment_regions[env] }

  name         = "${var.registry_url}/${var.project_name}:${each.key}"
  keep_locally = true
}

data "linode_images" "images" {

  for_each = { for env in var.project_environments :
  env => local.project_environment_regions[env] }
  filter {
    name = "label"
    values = [
      "${var.project_name}-${each.key}-image"
    ]
  }
}

data "linode_image" "project_image" {
  for_each = { for env in var.project_environments :
  env => local.project_environment_regions[env] }

  id = linode_images.images[each.key].id
}

resource "linode_instance" "project_instance" {
  for_each = { for env in var.project_environments : env => local.project_environment_regions[env] }
  region   = each.value[count.index]
  label    = "${var.project_name}-${each.key}-${each.value[count.index]}"
  image    = linode_image.project_image[each.key].id
  type     = "g6-standard-1"
  tags     = local.project_environment_tags[each.key]
}

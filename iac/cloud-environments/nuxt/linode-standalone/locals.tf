
locals {
  # Base tags applied to all environments
  base_tags = ["terraform", "docker", "github"]

  # Tags unique to each environment
  environment_tags = {
    production  = ["critical", "24x7"]
    staging     = ["testing", "internal"]
    development = ["dev", "internal"]
  }

  # Default regions
  default_regions = ["us-central"]

  # Regions per environment
  environment_regions = {
    production  = ["us-southeast", "us-east"]
    staging     = local.default_regions
    development = local.default_regions
  }

  # Compute project tags per environment
  project_environment_tags = {
    for env in var.project_environments :
    env => concat(var.project_tags, local.base_tags, lookup(local.environment_tags, env, []))
  }

  # Compute regions per environment
  project_environment_regions = {
    for env in var.project_environments :
    env => lookup(local.environment_regions, env, local.default_regions)
  }

  # Compute Docker image path per environment
  project_environment_docker_paths = {
    for env in var.project_environments :
    env => "docker_images/${var.project_name}/${env}/image.tar"
  }
}

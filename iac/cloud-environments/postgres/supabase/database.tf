resource "random_password" "project_database_password" {
  length  = 32
  special = true
}

resource "supabase_project" "project" {
  organization_id   = var.supabase_organization_id
  name              = var.project_name
  database_password = random_password.project_database_password.result
  region            = locals.project_environment_regions["production"]
  instance_size     = "micro"

  lifecycle {
    ignore_changes = [
      database_password,
      instance_size,
    ]
  }
}

resource "supabase_branch" "branch" {
  for_each           = toset(var.project_environments)
  parent_project_ref = supabase_project.project.id
  git_branch         = each.key
  region             = local.project_environment_regions[each.key]
}

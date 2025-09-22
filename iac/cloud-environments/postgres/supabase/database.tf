# resource "random_password" "project_database_password" {
#   count   = var.project_database_type == "postgresql" ? length(var.project_environments) : 0
#   length  = 32
#   special = true
# }

resource "supabase_project" "test" {
  organization_id   = locals.supabase_organization_id
  name              = var.project_name
  database_password = "bar"
  region            = "us-east-1"
  instance_size     = "micro"

  lifecycle {
    ignore_changes = [
      database_password,
      instance_size,
    ]
  }
}

resource "supabase_branch" "new" {
  parent_project_ref = "mayuaycdtijbctgqbycg"
  git_branch         = "main"
}

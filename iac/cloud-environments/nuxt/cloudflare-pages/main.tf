resource "cloudflare_pages_project" "project" {
  account_id        = ""
  name              = var.project_name
  production_branch = var.project_repository_branch

  build_config = {
    build_caching   = true
    build_command   = "pnpm run --filter=${var.project_name} build"
    destination_dir = "./projects/${var.project_name}/.output"
    root_dir        = "/"
  }
}

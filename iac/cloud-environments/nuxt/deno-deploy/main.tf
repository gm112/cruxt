resource "deno_deploy" "project" {
  name = var.project_name
}



# resource "deno_deploy_deployment" "project" {
#   project_id = deno_deploy.project.id
#   entry_point_url
# }

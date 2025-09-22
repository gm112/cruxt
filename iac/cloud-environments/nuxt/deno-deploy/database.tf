module "database" {
  source = var.source_terraform_modules_from_local ? "../../postgres/deno-deploy" : "git::${local.github_repository_url}/iac/cloud-environments/postgres/deno-deploy?ref=${local.github_ref}"
}

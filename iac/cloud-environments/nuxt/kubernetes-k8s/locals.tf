locals {
  github_repository_url = "https://${length(github_terraform_module_repository_personal_access_token) > 0 ? "${github_terraform_module_repository_personal_access_token}@" : ""}github.com/gm112/cruxt.git"
  github_ref            = "main"
}

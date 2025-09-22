variable "project_name" {
  type        = string
  description = "The name of the project to deploy."
  default     = "nuxt-v4-mobile-app-with-auth"
}

variable "project_repository_branch" {
  type        = string
  description = "The branch of the repository to deploy."
}

variable "project_repository_url" {
  type        = string
  description = "The URL of the repository to deploy."
}

variable "project_environment" {
  type        = string
  description = "The environment to deploy to."
  default     = "production"
}

variable "project_tags" {
  type        = list(string)
  description = "The tags to apply to the project."
  default     = []
}


variable "source_terraform_modules_from_local" {
  type        = bool
  description = "Whether to use local terraform modules."
  default     = true
}

variable "github_terraform_module_repository_personal_access_token" {
  type        = string
  description = "The personal access token for the github terraform module repository."
  sensitive   = true
  default     = env("GITHUB_ACCESS_TOKEN") ? env("GITHUB_ACCESS_TOKEN") : ""
}

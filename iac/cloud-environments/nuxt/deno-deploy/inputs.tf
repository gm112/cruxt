variable "deno_deploy_api_token" {
  type        = string
  description = "The API token to use for authentication with the Deno Deploy API."
  sensitive   = true
}

variable "deno_deploy_organization_id" {
  type        = string
  description = "The organization ID to use for authentication with the Deno Deploy API."
}

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

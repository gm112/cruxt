variable "projects" {
  type = map(object({
    name           = string
    repository_url = optional(string)
    environments   = list(string)
    tags           = list(string)
    database_type  = string
    env_vars       = map(string)
    cloud_provider = string
  }))
}

variable "github_repository_url" {
  type        = string
  description = "The URL of the repository to deploy. Used as a fallback if project_repository_url is not set."
  default     = env("GITHUB_REPOSITORY_URL")
}

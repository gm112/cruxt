variable "project_name" {
  type        = string
  description = "The name of the project to deploy."
}

variable "project_repository_url" {
  type        = string
  description = "The URL of the repository to deploy."
}

variable "project_repository_branch" {
  type        = string
  description = "The branch of the repository to deploy."
}

variable "project_environments" {
  type        = list(string)
  description = "The environment to deploy to."
  default     = ["development"]

  validation {
    condition     = contains(["development", "staging", "production"], var.project_environment)
    error_message = "Environment must be one of: development, staging, production."
  }
}

variable "project_tags" {
  type        = list(string)
  description = "The tags to apply to the project."
  default     = []
}

variable "project_database_type" {
  type        = string
  description = "The type of database to use."
  default     = "none"

  validation {
    condition     = contains(["postgresql", "supabase", "none"], var.project_database_type)
    error_message = "Database type must be one of: postgresql, supabase, none."
  }
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

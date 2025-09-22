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

variable "supabase_access_token" {
  type        = optional(string)
  description = "The Supabase access token."
  sensitive   = true
  default     = env("SUPABASE_ACCESS_TOKEN")

  validation {
    condition     = length(var.supabase_access_token) > 0
    error_message = "Supabase access token must be set."
  }
}

variable "supabase_organization_id" {
  type        = optional(string)
  description = "The Supabase organization ID."
  sensitive   = true
  default     = env("SUPABASE_ORGANIZATION_ID")

  validation {
    condition     = length(var.supabase_organization_id) > 0
    error_message = "Supabase organization ID must be set."
  }
}

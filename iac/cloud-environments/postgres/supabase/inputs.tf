variable "project_name" {
  type        = string
  description = "The name of the project to deploy."
}

variable "project_environments" {
  type        = list(string)
  description = "The environments to deploy to."
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

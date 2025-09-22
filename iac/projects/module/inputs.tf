variable "project_name" {
  type        = string
  description = "The name of the project to deploy."
}

variable "project_repository_url" {
  type        = string
  description = "The URL of the repository to deploy."
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
    condition     = contains(["postgresql", "none"], var.project_database_type)
    error_message = "Database type must be one of: postgresql, none."
  }
}

variable "project_env_vars" {
  type        = map(string)
  description = "Environment variables to set."
  default     = {}
}

variable "project_cloud_provider" {
  type        = string
  description = "The cloud provider to use."
  validation {
    condition     = contains(["deno-deploy", "linode-standalone", "aws-amplify", "cloudflare-pages"], var.project_cloud_provider)
    error_message = "Cloud provider must be one of: deno-deploy, linode-standalone, aws-amplify, cloudflare-pages."
  }
}

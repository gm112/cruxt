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


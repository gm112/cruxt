variable "label" {
  type        = string
  description = "The label of the database."
}

variable "region" {
  type        = string
  description = "The region of the database."
  default     = "us-mia"
}

variable "type" {
  type        = string
  description = "The type of the database."
  default     = "g6-nanode-1"
}

variable "engine_id" {
  type        = string
  description = "The engine ID of the database."
  default     = "postgresql/16"
}

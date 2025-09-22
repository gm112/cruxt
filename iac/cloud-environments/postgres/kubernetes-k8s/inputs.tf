variable "kubernetes_host" {
  type        = string
  description = "The Kubernetes host"
}

variable "kubernetes_config_path" {
  type        = string
  description = "The path to the Kubernetes config file"
  default     = "~/.kube/config"
}

variable "kubernetes_config_context" {
  type        = string
  description = "The Kubernetes config context"
  default     = ""
}

variable "kubernetes_cluster_name" {
  type        = string
  description = "The Kubernetes cluster name"
  default     = ""
}

variable "kubernetes_namespace" {
  type        = string
  description = "The Kubernetes namespace"
  default     = "default"
}

variable "kubernetes_service_account_name" {
  type        = string
  description = "The Kubernetes service account name"
  default     = "default"
}

variable "project_name" {
  type        = string
  description = "The name of the project to deploy."
}

variable "project_tags" {
  type        = list(string)
  description = "The tags to apply to the project."
  default     = []
}

variable "username" {
  type        = string
  description = "The username for the database."
  default     = "postgres"
}

variable "db_name" {
  type        = string
  description = "The name of the database."
  default     = "postgres"
}

variable "port" {
  type        = number
  description = "The port for the database."
  default     = 5432
}

variable "postgres_image" {
  type        = string
  description = "The image to use for the Postgres container."
  default     = "postgres:15.4"
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "name" {
  description = "Name for resources"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones for subnets"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to connect to DB"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "engine_version" {
  description = "Postgres engine version"
  type        = string
  default     = "15.4"
}

variable "instance_class" {
  description = "Instance size"
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "Allocated storage in GB"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "Max autoscaling storage in GB"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "username" {
  description = "Master username"
  type        = string
}

variable "port" {
  description = "Postgres port"
  type        = number
  default     = 5432
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot on deletion"
  type        = bool
  default     = true
}

variable "publicly_accessible" {
  description = "Whether DB is publicly accessible"
  type        = bool
  default     = false
}

variable "backup_retention_period" {
  description = "Backup retention days"
  type        = number
  default     = 7
}

variable "tags" {
  description = "Tags to apply"
  type        = map(string)
  default     = {}
}

variable "enable_rotation" {
  description = "Enable rotation for the secret"
  type        = bool
  default     = false
}

variable "rotation_lambda_arn" {
  description = "ARN of rotation Lambda (required if rotation enabled)"
  type        = string
  default     = ""
}

variable "rotation_days" {
  description = "Days between automatic secret rotation"
  type        = number
  default     = 30
}

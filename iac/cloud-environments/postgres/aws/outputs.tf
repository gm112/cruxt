output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.this.id
}

output "public_subnets" {
  description = "IDs of public subnets"
  value       = [for subnet in aws_subnet.public : subnet.id]
}

output "private_subnets" {
  description = "IDs of private subnets"
  value       = [for subnet in aws_subnet.private : subnet.id]
}

output "db_instance_endpoint" {
  description = "The connection endpoint"
  value       = aws_db_instance.this.endpoint
}

output "db_instance_arn" {
  description = "ARN of the DB instance"
  value       = aws_db_instance.this.arn
}

output "db_security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.this.id
}

output "db_secret_arn" {
  description = "ARN of the secret storing DB credentials"
  value       = aws_secretsmanager_secret.db_secret.arn
}

output "db_secret_name" {
  description = "Name of the secret storing DB credentials"
  value       = aws_secretsmanager_secret.db_secret.name
}

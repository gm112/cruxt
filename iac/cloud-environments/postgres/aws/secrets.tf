resource "aws_secretsmanager_secret" "db_secret" {
  name        = "${var.name}-db-credentials"
  description = "RDS credentials for ${var.name}"

  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "db_secret_value" {
  secret_id = aws_secretsmanager_secret.db_secret.id
  secret_string = jsonencode({
    username = var.username
    password = random_password.project_database_password.result
    engine   = "postgres"
    host     = aws_db_instance.this.address
    port     = var.port
    dbname   = var.db_name
  })
}

# (Optional) Attach secret to RDS for rotation/auto-updates
resource "aws_secretsmanager_secret_rotation" "db_rotation" {
  count               = var.enable_rotation ? 1 : 0
  secret_id           = aws_secretsmanager_secret.db_secret.id
  rotation_lambda_arn = var.rotation_lambda_arn
  rotation_rules {
    automatically_after_days = var.rotation_days
  }
}

resource "random_password" "this" {
  length  = 32
  special = true
}

resource "aws_db_instance" "this" {
  identifier              = var.name
  engine                  = "postgres"
  engine_version          = var.engine_version
  instance_class          = var.instance_class
  allocated_storage       = var.allocated_storage
  max_allocated_storage   = var.max_allocated_storage
  db_name                 = var.db_name
  username                = var.username
  password                = random_password.this.result
  port                    = var.port
  storage_encrypted       = true
  skip_final_snapshot     = var.skip_final_snapshot
  publicly_accessible     = var.publicly_accessible
  vpc_security_group_ids  = [aws_security_group.this.id]
  db_subnet_group_name    = aws_db_subnet_group.this.name
  backup_retention_period = var.backup_retention_period

  tags = var.tags
}

module "aws_database" {
  for_each = toset(var.project_database_type == "postgresql" ? var.project_environments : [])
  source   = "../../postgres/aws"
  region   = local.environment_regions[each.key]

  name     = "${var.project_name}-${each.key}"
  db_name  = "${var.project_name}-${each.key}"
  username = "postgres"

  vpc_cidr             = "10.0.0.0/16"
  availability_zones   = local.aws_region_availability_zones[each.key]
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.3.0/24", "10.0.4.0/24"]
  allowed_cidr_blocks  = ["x.x.x.x/32"]
}

module "kubernetes_database" {
  for_each             = toset(var.project_database_type == "postgresql-k8s" ? var.project_environments : [])
  source               = "../../postgres/kubernetes-k8s"
  kubernetes_namespace = var.project_name

  project_name = var.project_name
  username     = "postgres"
  db_name      = "${var.project_name}-${each.key}"

  port            = 5432
  kubernetes_host = ""
}

module "supabase_database" {
  for_each = toset(var.project_database_type == "supabase" ? var.project_environments : [])
  source   = "../../postgres/supabase"

  project_name = var.project_name

  supabase_access_token    = env("SUPABASE_ACCESS_TOKEN")
  supabase_organization_id = env("SUPABASE_ORGANIZATION_ID")
}

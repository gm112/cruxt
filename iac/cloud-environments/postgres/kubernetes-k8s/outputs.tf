output "db_instance_endpoint" {
  description = "The connection endpoint"
  value       = kubernetes_service.this.status[0].load_balancer[0].ingress[0].hostname
}

output "db_instance_secret_name" {
  description = "The secret name in the kubernetes cluster"
  value       = kubernetes_secret.this.metadata[0].name
}

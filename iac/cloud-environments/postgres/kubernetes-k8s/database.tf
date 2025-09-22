resource "random_password" "this" {
  length  = 32
  special = true
}

resource "kubernetes_namespace" "this" {
  metadata {
    name = var.kubernetes_namespace
  }
}

resource "kubernetes_service_account" "this" {
  metadata {
    name      = var.kubernetes_service_account_name
    namespace = var.kubernetes_namespace
  }
}

resource "kubernetes_cluster_role" "this" {
  metadata {
    name = "${var.project_name}-postgres-cluster-role"
  }

  rule {
    api_groups = [""]
    resources  = ["secrets"]
    verbs      = ["get", "list", "watch"]
  }
}

resource "kubernetes_cluster_role_binding" "this" {
  metadata {
    name = "${var.project_name}-postgres-cluster-role-binding"
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = kubernetes_cluster_role.this.metadata[0].name
  }

  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account.this.metadata[0].name
    namespace = var.kubernetes_namespace
  }
}

resource "kubernetes_secret" "this" {
  metadata {
    name      = var.project_name
    namespace = var.kubernetes_namespace
  }

  data = {
    username = var.username
    password = random_password.this.result
    engine   = "postgres"
    host     = kubernetes_service.this.status[0].load_balancer[0].ingress[0].hostname
    port     = var.port
    dbname   = var.db_name
  }
}

resource "kubernetes_service" "this" {
  metadata {
    name      = var.project_name
    namespace = var.kubernetes_namespace
  }

  spec {
    type = "LoadBalancer"

    selector = {
      app = var.project_name
    }

    port {
      name        = "http"
      protocol    = "TCP"
      port        = var.port
      target_port = var.port
    }
  }
}

resource "kubernetes_deployment" "this" {
  metadata {
    name      = var.project_name
    namespace = var.kubernetes_namespace
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = var.project_name
      }
    }
    template {
      metadata {
        labels = {
          app = var.project_name
        }
      }
      spec {
        container {
          image = var.postgres_image
          name  = var.project_name

          env {
            name  = "POSTGRES_USER"
            value = var.username
          }
          env {
            name  = "POSTGRES_PASSWORD"
            value = random_password.this.result
          }
          env {
            name  = "POSTGRES_DB"
            value = var.db_name
          }
        }
      }
    }
  }
}

resource "kubernetes_ingress" "this" {
  metadata {
    name      = "${var.project_name}-ingress"
    namespace = var.kubernetes_namespace
  }
  spec {
    rule {
      http {
        path {
          path = "/"
          backend {
            service_name = kubernetes_service.this.metadata[0].name
            service_port = kubernetes_service.this.spec[0].port[0].port
          }
        }
      }
    }
  }
}

resource "kubernetes_config_map" "this" {
  metadata {
    name      = var.project_name
    namespace = var.kubernetes_namespace
  }
}

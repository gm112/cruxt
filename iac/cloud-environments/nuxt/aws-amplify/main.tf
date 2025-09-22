resource "aws_amplify_app" "project" {
  name       = var.project_name
  repository = var.project_repository_url

  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm install
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
      environmentVariables:
        - name: NUXT_PUBLIC_I18N_BASE_URL
          value: https://example.com
  EOT

  enable_auto_branch_creation = true
  auto_branch_creation_patterns = [
    "main"
  ]

  auto_branch_creation_config {
    enable_auto_build = true
  }

}

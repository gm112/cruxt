variable "projects" {
  type = map(object({
    name           = string
    repository_url = string
    environments   = list(string)
    tags           = list(string)
    database_type  = string
    env_vars       = map(string)
    cloud_provider = string
  }))
}

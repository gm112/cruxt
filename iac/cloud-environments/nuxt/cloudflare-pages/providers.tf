terraform {
  required_version = ">= 1.13.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.10.1"
    }
  }
}

provider "cloudflare" {
  api_token = env("CLOUDFLARE_API_TOKEN")
}

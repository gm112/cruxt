terraform {
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

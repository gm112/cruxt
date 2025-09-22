terraform {
  required_version = ">= 1.13.0"
  required_providers {
    linode = {
      source  = "linode/linode"
      version = "3.3.0"
    }

    docker = {
      source  = "kreuzwerker/docker"
      version = "3.6.2"
    }
  }
}

provider "linode" {
}

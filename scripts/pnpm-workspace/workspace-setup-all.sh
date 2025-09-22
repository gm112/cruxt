#!/usr/bin/env bash
set -e



if [ -z $DENO_DEPLOY ]; then
  pnpm workspace:setup:generate-tsconfig-project-references
  pnpm workspace:setup:generate-tfvars

  if [ ! -f ./shared/localhost/localhost.pem ] && [ command -v mkcert ]; then
    pnpm run workspace:generate-certs
  fi
fi

if [ -d ./layers/base/.nuxt ]; then
  exit 0
fi

pnpm run --parallel dev:prepare || true

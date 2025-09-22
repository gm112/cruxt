# GitHub Workflows for Cruxt

## [ci.yml](./ci.yml)

This workflow is responsible for building the project and running linting and tests. It will also automatically approve dependabot PRs.

It is triggered on pushes to the `main` branch and on pull requests to the `main` branch.

If you want to use this workflow, you can use it as a reusable workflow.

```yaml
name: CI
on:
  pull_request:
    branches:
      - main
    paths:
      - '.github/workflows/ci.yml'
      - '.github/actions/*'
      - '.nvmrc'
      - 'pnpm-workspace.yaml'
      - 'pnpm-lock.yaml'
      - 'package.json'
      - 'layers/*'
      - 'projects/*'
  push:
    branches:
      - main
    paths:
      - '.github/workflows/ci.yml'
      - '.github/actions/*'
      - '.nvmrc'
      - 'pnpm-workspace.yaml'
      - 'pnpm-lock.yaml'
      - 'package.json'
      - 'layers/*'
      - 'projects/*'

jobs:
  build:
    uses: cruxt/cruxt/.github/workflows/ci.yml@main
```

## Actions

- [action-build-pnpm-workspace](../actions/build-pnpm-workspace/README.md)
- [action-auto-approve-dependabot](../actions/auto-approve-dependabot/README.md)

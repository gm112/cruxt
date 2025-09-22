# GitHub Workflows for Cruxt

## [ci.yml](./ci.yml)

This workflow is responsible for building the project and running linting and tests.

It is triggered on pushes to the `main` branch and on pull requests to the `main` branch.

If you want to use this workflow, you can use it as a reusable workflow.

```yaml
name: CI
on:
  pull_request:
    branches:
      - main
  pull_request_target:
    branches:
      - main
  push:
    branches:
      - main
      
jobs:
  build:
    uses: cruxt/cruxt/.github/workflows/ci.yml@main
```

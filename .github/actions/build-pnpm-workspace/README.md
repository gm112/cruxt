# build-pnpm-workspace

This action builds the project and runs linting and tests, using pnpm workspaces.

## Inputs

### `upload-coverage`

**Required:** `false`

**Default:** `false`

**Description:** Upload coverage reports to Codecov

### `upload-build-artifacts`

**Required:** `false`

**Default:** `false`

**Description:** Upload build artifacts to GitHub

### `overwrite-build-artifacts`

**Required:** `false`

**Default:** `false`

**Description:** Overwrite existing build artifacts

### `build-output-directory`

**Required:** `false`

**Default:** `.output`

**Description:** Directory to output build artifacts

### `upload-artifact-name`

**Required:** `false`

**Default:** `${{ github.workflow }}-${{ github.sha }}`

**Description:** Name of the artifact to upload

## Outputs

### `build-artifacts-path`

**Description:** Path to the build artifacts

### `build-artifacts-name`

**Description:** Name of the build artifacts

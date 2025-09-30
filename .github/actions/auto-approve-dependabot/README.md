# auto-approve-dependabot

Automatically approve dependabot PRs if the workflow is triggered by dependabot.

## Inputs

### `github-token`

**Required:** false

**Default:** `${{ github.token }}`

## Outputs

None

## Permissions

**Required:** `contents: read`

**Required:** `pull-requests: write`

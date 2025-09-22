# Workspace Scripts

## [pnpm-workspace](./pnpm-workspace)

This folder contains scripts that are used to manage the pnpm workspace.

### [pnpm-workspace/workspace-setup-all.sh](./pnpm-workspace/workspace-setup-all.sh)

This script is used to setup the pnpm workspace. It is run automatically when `pnpm install` is run.

### [pnpm-workspace/update-tsconfig.sh](./pnpm-workspace/update-tsconfig.sh)

This script is used to update the tsconfig.json files in the pnpm workspace. It is run automatically when `pnpm install` is run.

## [terraform](./terraform)

This folder contains scripts that are used to manage the terraform workspace.

### [terraform/generate-tfvars.sh](./terraform/generate-tfvars.sh)

This script is used to generate the [terraform.tfvars](../iac/projects/terraform.tfvars) file. The script scans the [projects](../projects) folder for projects to add/remove/update to the [terraform.tfvars](../iac/projects/terraform.tfvars) It is run automatically when `pnpm install` is run.

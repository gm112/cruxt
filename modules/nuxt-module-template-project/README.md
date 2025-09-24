<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: @cruxt/nuxt-module-template-project
- Package name: @cruxt/nuxt-module-template-project
- Description: Description of the module goes here.
- Repository slug: @cruxt/module-repo
- Repository URL: https://github.com/your-org/@cruxt/module-repo
Use this simple bash one liner to update the name and description:

```bash
bash -c '
# Check if Git repo is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "Warning: Git repo is not clean. Replacements skipped."
  exit 0
fi

# Prompt for replacement values
read -p "Enter new project display name: " NEW_PROJECT_NAME
read -p "Enter new package name: " NEW_PACKAGE_NAME
read -p "Enter new module description: " NEW_MODULE_DESCRIPTION
read -p "Enter new config key: " NEW_CONFIG_KEY
read -p "Enter new repository slug: " NEW_REPO_SLUG
read -p "Enter new repository URL: " NEW_REPO_URL

# Escape special characters for safe sed replacement
ESCAPED_PROJECT_NAME=$(printf "%s" "$NEW_PROJECT_NAME" | sed "s/[&/\]/\\&/g")
ESCAPED_PACKAGE_NAME=$(printf "%s" "$NEW_PACKAGE_NAME" | sed "s/[&/\]/\\&/g")
ESCAPED_MODULE_DESCRIPTION=$(printf "%s" "$NEW_MODULE_DESCRIPTION" | sed "s/[&/\]/\\&/g")
ESCAPED_CONFIG_KEY=$(printf "%s" "$NEW_CONFIG_KEY" | sed "s/[&/\]/\\&/g")
ESCAPED_REPO_SLUG=$(printf "%s" "$NEW_REPO_SLUG" | sed "s/[&/\]/\\&/g")
ESCAPED_REPO_URL=$(printf "%s" "$NEW_REPO_URL" | sed "s/[&/\]/\\&/g")

# Find all text files and perform replacements
find . -type f ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sh -c '
for file_path; do
  if file "$file_path" | grep -q text; then
    sed -i \
      -e "s|@cruxt/nuxt-module-template-project|$0|g" \
      -e "s|@cruxt/nuxt-module-template-project|$1|g" \
      -e "s|cruxt_nuxt_module_template_project|$2|g" \
      -e "s|@cruxt/module-repo|$3|g" \
      -e "s|https://github.com/your-org/@cruxt/module-repo|$4|g" \
      -e "s|Description of the module goes here.|$5|g" "$file_path"
  fi
done
' sh "$ESCAPED_PROJECT_NAME" "$ESCAPED_PACKAGE_NAME" "$ESCAPED_CONFIG_KEY" "$ESCAPED_REPO_SLUG" "$ESCAPED_REPO_URL" "$ESCAPED_MODULE_DESCRIPTION"

echo "Replacement complete!"
'


```
-->

# @cruxt/nuxt-module-template-project

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Description of the module goes here.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/@cruxt/module-repo?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- ⛰ &nbsp;Foo
- 🚠 &nbsp;Bar
- 🌲 &nbsp;Baz

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
# npm
npx nuxi module add @cruxt/nuxt-module-template-project

# pnpm
pnpx nuxi module add @cruxt/nuxt-module-template-project

# yarn
yarn nuxi module add @cruxt/nuxt-module-template-project
```

That's it! You can now use @cruxt/nuxt-module-template-project in your Nuxt app ✨

## Contribution

<!-- markdownlint-disable MD033 -->
<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm run dev:prepare
  
  # Develop with the playground
  pnpm run dev
  
  # Build the playground
  pnpm run dev:build
  
  # Run ESLint
  pnpm run lint
  
  # Run Vitest
  pnpm run test
  pnpm run test:watch
  
  # Release new version
  pnpm run release
  ```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@cruxt/nuxt-module-template-project/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@cruxt/nuxt-module-template-project

[npm-downloads-src]: https://img.shields.io/npm/dm/@cruxt/nuxt-module-template-project.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@cruxt/nuxt-module-template-project

[license-src]: https://img.shields.io/npm/l/@cruxt/nuxt-module-template-project.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@cruxt/nuxt-module-template-project

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com

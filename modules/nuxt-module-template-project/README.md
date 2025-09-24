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
if [ -n "$(git status --porcelain)" ]; then
  echo "Warning: Git repo is not clean. Replacements skipped."
  exit 0
fi
read -p "New project name: " N
read -p "New package name: " P
read -p "New description: " D
read -p "New config key: " C
read -p "New repo slug: " S
read -p "New repo URL: " U
EN=$(printf "%s" "$N" | sed "s/[&/\]/\\&/g")
EP=$(printf "%s" "$P" | sed "s/[&/\]/\\&/g")
ED=$(printf "%s" "$D" | sed "s/[&/\]/\\&/g")
EC=$(printf "%s" "$C" | sed "s/[&/\]/\\&/g")
ES=$(printf "%s" "$S" | sed "s/[&/\]/\\&/g")
EU=$(printf "%s" "$U" | sed "s/[&/\]/\\&/g")
find . -type f ! -path "*/node_modules/*" ! -path "*/.git/*" -exec sh -c '\''for f; do file "$f" | grep -q text && sed -i \
  -e "s|@cruxt/nuxt-module-template-project|$0|g" \
  -e "s|@cruxt/nuxt-module-template-project|$1|g" \
  -e "s|cruxt_nuxt_module_template_project|$2|g" \
  -e "s|@cruxt/module-repo|$3|g" \
  -e "s|https://github.com/your-org/@cruxt/module-repo|$4|g" \
  -e "s|Description of the module goes here.|$5|g" "$f"; done'\'' sh "$EN" "$EP" "$EC" "$ES" "$EU" "$ED"
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

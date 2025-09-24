<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: @cruxt/nuxt-module-template-project
- Package name: @cruxt/nuxt-module-template-project
- Description: Configures and installs capacitor within a nuxt project.
Use this simple bash one liner to update the name and description:

```bash
find . -type f -name "*.md" -exec sed -i '' -e "s/@cruxt\/nuxt-module-template-project/@your-org\/@cruxt\/nuxt-module-template-project/g" {} +
find . -type f -name "*.md" -exec sed -i '' -e "s/Configures and installs capacitor within a nuxt project./Configures and installs capacitor within a nuxt project./g" {} +
```
-->

# @cruxt/nuxt-module-template-project

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Configures and installs capacitor within a nuxt project.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/@cruxt/nuxt-module-template-project?file=playground%2Fapp.vue) -->
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

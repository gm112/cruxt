#!/bin/env bash

set -e # exit on error

PACKAGE_NAME="$1"
DESCRIPTION="${2:-Description of the module goes here.}"
REPOSITORY_URL="${3:-https://github.com/@cruxt/module-repo}"
REPOSITORY_SLUG="${4:-@cruxt/module-repo}"
STACKBLITZ_URL="${5:-https://stackblitz.com/github/@cruxt/module-repo?file=playground%2Fapp.vue}"
DOCUMENTATION_URL="${6:-https://example.com}"

if [ -z "$PACKAGE_NAME" ]; then
  echo "Please provide a package name."
  exit 1
fi

echo "🚀 Generating new module: $PACKAGE_NAME"

if [ ! -d "modules" ]; then
  echo "🚨 No modules directory found. Please run this script from the root of the project."
  exit 1
fi

cd modules
mkdir -p "$PACKAGE_NAME"
cp -R ./nuxt-module-template-project/. "$PACKAGE_NAME"/
cd "$PACKAGE_NAME"

# Determine the OS for sed compatibility
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_INLINE=(-i '')
else
  SED_INLINE=(-i)
fi

replace_in_files() {
  local search="$1"
  local replace="$2"
  find . -type f -exec sed "${SED_INLINE[@]}" "s|$search|$replace|g" {} +
}

replace_in_files "@cruxt/nuxt-module-template-project" "$PACKAGE_NAME"
replace_in_files "Description of the module goes here." "$DESCRIPTION"
replace_in_files "https://github.com/@cruxt/module-repo" "$REPOSITORY_URL"
replace_in_files "@cruxt/module-repo" "$REPOSITORY_SLUG"
replace_in_files "https://stackblitz.com/github/@cruxt/module-repo?file=playground%2Fapp.vue" "$STACKBLITZ_URL"
replace_in_files "https://example.com" "$DOCUMENTATION_URL"

echo "🎉 Done! You can now run 'pnpm run dev' to start developing your module."

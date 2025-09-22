# Contributing

- [Contributing](#contributing)
  - [Development Guide](#development-guide)
    - [Install dependencies](#install-dependencies)
    - [Project setup](#project-setup)
  - [Development Process](#development-process)
    - [Run the playground](#run-the-playground)
    - [Run the tests](#run-the-tests)
    - [Format/lint the code before committing](#formatlint-the-code-before-committing)
  - [See also](#see-also)

## Development Guide

### Install dependencies

- [ ] [Install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [ ] [Install Node.js](https://nodejs.org/en/download/) (any version >= 22)
- [ ] Have bash installed.
- [ ] Run `npm install -g corepack@latest`
- [ ] Have [mkcert](https://github.com/FiloSottile/mkcert#installation) installed.
  - If you're on Windows, you can simply run `winget install --id=FiloSottile.mkcert -e` to install it.

Woohoo! You're ready to go!

### Project setup

- [ ] Clone the project

```bash
git clone https://github.com/gm112/cruxt
```

- [ ] Install dependencies

```bash
cd cruxt
corepack enable
pnpm install
```

## Development Process

All of the following commands are run from the root of the project. If you've followed this guide, you should be in the `cruxt` directory already.

### Run the playground

```bash
pnpm playground
```

Make your changes!

### Run the tests

```bash
pnpm test:all
```

### Format/lint the code before committing

```bash
pnpm format:all
```

And don't forget to verify that all errors are fixed:

```bash
pnpm lint:all
```

If all is well, you can commit your changes.

```bash
git add .
git commit -m "fix: fixing something"
```

## See also

- [Scripts Documentation](./scripts/README.md)
- [Terraform Workspace Documentation](./iac/projects/README.md)
- [GitHub Actions Documentation](./.github/workflows/README.md)

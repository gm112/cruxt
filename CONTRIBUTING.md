# Contributing

- [Contributing](#contributing)
  - [Development Guide](#development-guide)
    - [Install dependencies](#install-dependencies)
    - [Project setup](#project-setup)
  - [Development Process](#development-process)
    - [Run the playground](#run-the-playground)
    - [Run the tests](#run-the-tests)
    - [Format/lint the code before committing](#formatlint-the-code-before-committing)

## Development Guide

### Install dependencies

- [ ] [Install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [ ] [Install Node.js](https://nodejs.org/en/download/) (any version >= 22)
- [ ] Run `npm install -g corepack@latest`

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

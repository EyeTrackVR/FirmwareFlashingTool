# Firmware Flashing Tool

This is a streamlined `Tauri` app using `Vite` and `SolidJS`.

A firmware flashing tool for the [Open Source EyeTrackVR hardware](https://docs.eyetrack.vr) project.

This repo includes:

- [Tauri](https://tauri.app/)
- [JSDoc](https://jsdoc.app/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Proper VSCode Workspace](./firmwareflasher.code-workspace)

## Usage

> [!WARNING]\
This project uses `pnpm` by default, and utilizes `pnpm workspaces`. If you do not have `pnpm` installed, you can install it with `npm install -g pnpm`.

You _can_ use `yarn` or `npm`, however, _you_ will need to modify the project to remove the `pnpm` specific commands and workspace.

## Setup
### Step 1 - setup node environment

```bash
pnpm run setup
```
### Step 2 - setting up the backend binary

To actually compile the project, you'll also need a binary of the ETVR backend from [here]().

Clone the project, follow its readme to set it up and build the binary. 
Once done, copy the result into [backend_bin](/src-tauri/backend_bin) and rename it to `ETVR-<target-triple>`

The target triple can be obtained by running 

```bash
rustc -Vv
```

The info you're looking for will be stored under `host:`, for example `host: x86_64-pc-windows-msvc`
So the copied binary should be named like `ETVR-x86_64-pc-windows-msvc`

### Step 3

Run the project

```bash
pnpm tauri dev
```

## Available Scripts

See the [`package.json`](/package.json) for all available scripts.

### `pnpm tauri dev`

Runs the app in the development mode.<br>

An app should launch on your desktop.

The page will reload if you make edits.<br>

### `pnpm docs`

Uses `JSDoc` to build a documentation website based on the projects documentation.

### `pnpm lint`

Runs `eslint` on all of the included files.

### `pnpm format`

Uses `Prettier` and the above `pnpm lint` command to lint and then format all included file types.

## Development

This project follows the architecture Tauri laid down - `Tauri Plugins` and commands, to communicate with the hardware. 
These plugins are located in the [`src-tauri/src/lib`](/src-tauri/src/lib) folder.

## Deployment

To build the app, run the following:

```bash
pnpm tauri build
```

Builds the app for production to the `src-tauri/target` folder.<br>
This will correctly bundle Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

## Updating version for CI

### Requirements

Install UV:
- https://docs.astral.sh/uv/

Then, in the project root run: 
```shell
uv sync
```

### Beta version

First, make sure your changes are merged into the `beta` branch and that you're currently checked out on it.
Once done, run: 

```shell
uv run bumpver update --tag-num --tag beta --dry
```

Check if your changes look good, and if so: 

```shell
uv run bumpver update --tag-num --tag beta
```

This will push the new bump commit with a special tag that will trigger a fresh beta build

## Release version

Follow the same steps as for `Beta` version but instead of tag beta use one of the following

- `--patch` - for patch updates
- `--minor` - for minor changes
- `--major` - for breaking changes

## Pushing the new version to Github

Unfortunately, since bumpver doesn't support setting v in git tags, we have to do one more step

```shell
git tag v<new_tag> <bumpver_tag>
```

for example
```shell
git tag v1.7.1-beta.2 1.7.1-beta.2
```

Once done:

```shell
git push --follow-tags
```
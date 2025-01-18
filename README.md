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

This project uses custom `Tauri Plugins` to communicate with the hardware. These plugins are located in the [`src-tauri/src/lib`](/src-tauri/src/lib) folder.

> [!WARNING]\
> You **must** run the following command to install the project deps and build the plugins before running the app:

```bash
pnpm run setup
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

## Deployment

To build the app, run the following:

```bash
pnpm tauri build
```

Builds the app for production to the `src-tauri/target` folder.<br>
This will correctly bundle Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

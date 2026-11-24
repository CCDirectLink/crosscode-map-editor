[![Discord Server](https://img.shields.io/discord/382339402338402315.svg?label=Discord%20Server)](https://discord.gg/3Xw69VjXfW)
[![GitHub release](https://img.shields.io/github/release/CCDirectLink/crosscode-map-editor.svg)](https://GitHub.com/CCDirectLink/crosscode-map-editor/releases/)

# CrossCode Map Editor


A Map Editor for the game [CrossCode](http://www.cross-code.com/en/home), build with [Angular](https://angular.io/) and [Phaser](https://phaser.io/).

![editor](https://user-images.githubusercontent.com/9483499/94266096-eb0df280-ff39-11ea-907c-7b6a40c983cb.png)

## Changelog
[Learn about the latest improvements](CHANGELOG.md).

## Getting started
If you just want to use the editor install the latest [Release](https://github.com/CCDirectLink/crosscode-map-editor/releases/latest).

## Getting started - Development

### webapp
Move into the `webapp` folder and then install dependencies via `npm`
| :warning: Dependencies are required only for Electron, devDependencies are included in the Angular build. |
|---|
```
npm install
```
and then run the dev server with
```
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
## Commands

### Webapp
* `npm start`: Builds the project and continues to do so as files are changed as long as the command is running. Also starts a webserver at http://localhost:4200/ that can be used to access the project in a regular browser.
* `npm run electron:dev`: Starts a new electron developer instance that connects to `npm start` to run the project.
* `npm run dist`: Builds the project once in production mode so that you can share it's executable or installer.

[![Discord Server](https://img.shields.io/discord/382339402338402315.svg?label=Discord%20Server)](https://discord.gg/TFs6n5v)
[![GitHub release](https://img.shields.io/github/release/CCDirectLink/crosscode-map-editor.svg)](https://GitHub.com/CCDirectLink/crosscode-map-editor/releases/)

# CrossCode Map Editor


A Map Editor for the game [CrossCode](http://www.cross-code.com/en/home), build with [Angular](https://angular.io/) and [Phaser](https://phaser.io/).

![editor](https://user-images.githubusercontent.com/9483499/94266096-eb0df280-ff39-11ea-907c-7b6a40c983cb.png)

## Changelog
[Learn about the latest improvements](CHANGELOG.md).

## Getting started
If you just want to use the editor install the latest [Release](https://github.com/CCDirectLink/crosscode-map-editor/releases/latest).

## Getting started - Development

For development you need to do in order:
1. build the `common` module
2. run `backend` and `webapp`

`common` is a shared module containing code both the `backend` and `webapp` use.

### common 

move into the `common` folder and then install dependencies via `npm`
```
npm install
```
build the code with
```
npm start
```

### backend
move into the `backend` folder and then install dependencies via `npm`
```
npm install
```
Open the file `src/config.ts` and change the path to your CrossCode assets folder.
After that move back to the `backend` folder and start the server with
```
npm start
```

### webapp
move into the `webapp` folder and then install dependencies via `npm`
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

## Projects

### Common
*Common* is a project that holds some utility code that requires nodejs and as such cannot run in a normal browser.

### Backend
*Backend* is a simple nodejs server that does nothing else but to listen for webrequests from a normal browser and call the code from *common*.

### Webapp
*Webapp* is the main project of the editor and contains code that either can both run in browser and electron or electron exclusive as long as there is no way for the browser to provide the desired features. For features that require file interactions (saving, loading, discovery, etc) it either directly calls *common* when using electron or uses *backend* when using the browser.

## Commands

### Common
* `npm start`: Builds the project and continues to do so as files are changed as long as the command is running.
* `npm run build`: Build the project only once.

### Backend
Requires *common* to be built at least once.

* `npm start`: Start the webserver required for use *webapp* in regular browser.

### Webapp
Requires *common* to be built at least once.

* `npm start`: Builds the project and continues to do so as files are changed as long as the command is running. Also starts a webserver at http://localhost:4200/ that can be used to access the project in a regular browser.
* `npm run electron:dev`: Starts a new electron developer instance that connects to `npm start` to run the project.
* `npm run dist`: Builds the project once in production mode so that you can share it's executable or installer.

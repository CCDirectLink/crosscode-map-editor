[![Discord Server](https://img.shields.io/discord/382339402338402315.svg?label=Discord%20Server)](https://discord.gg/SJmMZKy)
# CrossCode Map Editor

A Map Editor for the game [CrossCode](http://www.cross-code.com/en/home), build with [Angular](https://angular.io/) and [Phaser](https://phaser.io/).

![editor](https://user-images.githubusercontent.com/9483499/29732155-acc24a46-89e7-11e7-9500-7fd1066a01a0.png)

## Features
- automatic height map generation https://youtu.be/hHkvK48lvr0

## Getting started

To use the editor you need to run the backend and the webapp

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
```
npm install
```
and then run the dev server with
```
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

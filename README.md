# CrossCode Map Editor

CrossCode Map Editor build with [Angular](https://angular.io/) and [Phaser](https://phaser.io/).

## Getting started

install dependencies via `npm`
```
npm install
```
and then run the dev server with
```
npm start
```

The editor needs access to CrossCode's source files, so you need to serve the files somehow.
An easy way to do this is to install [http-server](https://github.com/indexzero/http-server) globally with
```
npm install http-server -g
```
and then run the server inside your `CrossCode/assets` folder
```
cd D:\CrossCode\assets
http-server -a localhost -p 8080 --cors
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

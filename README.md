# CrossCode Map Editor

CrossCode Map Editor build with [Angular](https://angular.io/) and [Phaser](https://phaser.io/). It's still early in development so don't expect too much.

![editor](https://user-images.githubusercontent.com/9483499/29732155-acc24a46-89e7-11e7-9500-7fd1066a01a0.png)


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

'use strict';

const {app, BrowserWindow} = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const url = require('url');
const {autoUpdater} = require("electron-updater");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
const args = process.argv.slice(1);
const dev = args.some(val => val === '--dev');
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';

function createWindow() {
	
	const mainWindowState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800
	});
	
	win = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		webPreferences: {webSecurity: false}
	});
	
	if (dev) {
		console.log('dev');
		win.loadURL('http://localhost:4200/index.html');
		win.webContents.openDevTools();
	} else {
		console.log('prod');
		const indexPath = url.format({
			pathname: path.join(__dirname, 'distAngular', 'index.html'),
			protocol: 'file',
			slashes: true
		});
		console.log('path', indexPath);
		win.loadURL(indexPath);
		
		const log = require("electron-log");
		log.transports.file.level = "debug";
		autoUpdater.logger = log;
		// autoUpdater.checkForUpdatesAndNotify();
		// win.webContents.openDevTools();
		// win.setMenu(null);
	}
	
	win.on('closed', () => {
		win = null;
		app.quit()
	});
	
	mainWindowState.manage(win);
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow()
	}
});

'use strict';

const {app, BrowserWindow} = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const url = require('url');
const {autoUpdater} = require("electron-updater");
const contextMenu = require('electron-context-menu');
const {IPC} = require('node-ipc');
const {ipcMain} = require('electron');
const semver = require('semver');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const args = process.argv.slice(1);
const dev = args.some(val => val === '--dev');
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';

// context menu

contextMenu({
	showInspectElement: true
});

let openWindows = 0;

function openWindow() {
	let win;
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
			webPreferences: {
				webSecurity: false,
				nodeIntegration: true
			}
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
			
			// win.webContents.openDevTools();
			// win.setMenu(null);
		}
		
		openWindows++;
		win.on('closed', () => {
			win = null;
			openWindows--;
			if (openWindows == 0) {
				app.quit();
			}
		});
		
		mainWindowState.manage(win);
	}

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (win === null) {
			createWindow()
		}
	});
	
	createWindow();
}

app.on('ready', openWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
});


const sub = new IPC();
sub.config.silent = true;
sub.config.maxRetries = 1;
sub.connectTo('crosscode-map-editor', () => {
	sub.of['crosscode-map-editor'].on('connect', () => {
		sub.disconnect('crosscode-map-editor');
		app.quit();
	});
	sub.of['crosscode-map-editor'].on('error', () => {
		sub.disconnect('crosscode-map-editor');

		const master = new IPC();
		master.config.silent = true;
		master.config.id = 'crosscode-map-editor'
		master.serve(() => {
			master.server.on('connect', () => openWindow());
		});
		master.server.start();
	});
});



// check for update
const log = require("electron-log");
log.transports.file.level = "debug";
autoUpdater.logger = log;
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

ipcMain.on('update-check', (event, arg) => {
	autoUpdater.checkForUpdates().then(({versionInfo, updateInfo}) => {
		if (semver.lt(versionInfo.version, updateInfo.version)) {
			event.reply('update-check-result', updateInfo.version);
		} else {
			console.log('No new updates available');
			event.reply('update-check-result', '');
		}
	});
});

// do the update
ipcMain.on('update-download', (event, arg) => {
	
	autoUpdater.signals.updateDownloaded(() => {
		autoUpdater.quitAndInstall();
	});

	autoUpdater.downloadUpdate().then(({versionInfo, updateInfo}) => {
		event.reply('update-download-result', '');
	});


});
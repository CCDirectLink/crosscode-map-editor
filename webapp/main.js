const {app, BrowserWindow} = require('electron');
const windowStateKeeper = require('electron-window-state');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
const args = process.argv.slice(1);
const prod = args.some(val => val === '--prod');
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
	
	if (prod) {
		console.log('prod');
		win.loadFile('dist/index.html');
		// win.webContents.openDevTools();
		// win.setMenu(null);
	} else {
		console.log('dev');
		win.loadURL('http://localhost:4200/index.html');
		win.webContents.openDevTools();
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

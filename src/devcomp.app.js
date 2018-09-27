

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const {ipcMain} = require('electron')


const DEVCOMP_DEBUG = process.env.DEVCOMP_DEBUG;
const DEVCOMP_PWD = process.env.DEVCOMP_PWD;
const DEVCOMP_ROOT_DOC = process.env.DEVCOMP_ROOT_DOC;


const PROCMAN_PIDS_FILE = process.env.PROCMAN_PIDS_FILE;
const PROCMAN_PID_FILE = process.env.PROCMAN_PID_FILE;


function createWindow () {
    
    if (PROCMAN_PIDS_FILE) {
        // TODO: Optionally log path to file containing more PIDs or files.
        fs.appendFileSync(PROCMAN_PIDS_FILE, process.pid + "\n", "utf8");
    }

    process.on('SIGTERM', function () {

        console.error('Received SIGTERM. Existing ...');

        process.exit(0);
    });


    ipcMain.on('ready', (event) => {

        if (DEVCOMP_ROOT_DOC) {

            try {

                var docPath = path.resolve(DEVCOMP_PWD, DEVCOMP_ROOT_DOC);

                if (DEVCOMP_DEBUG) console.log("docPath:", docPath);

                var doc = JSON.parse(fs.readFileSync(docPath, "utf8"));

            } catch (err) {
                console.error("Error parsing JSON document: " + EVCOMP_ROOT_DOC);
                throw err;
            }

            mainWindow.webContents.send("doc", JSON.stringify(doc));
        }
    });


  // Create the browser window.
    mainWindow = new BrowserWindow({width: 1200, height: 600})



    var UTIL_API = require("bash.origin").depend("bash.origin.electron#s1");



    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))


    if (DEVCOMP_DEBUG) {
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    }
    


//          DEVCOMP_ROOT_DOC
/*
{
        "@http://localhost:8080/dist/devcomp": {
          "message": "hello"
        }
    }
*/      


    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}


ipcMain.on('exit', function () {

    console.error("Exit event received!");

    if (PROCMAN_PID_FILE) {
        var pid = fs.readFileSync(PROCMAN_PID_FILE).toString();

        console.error("kill process manager pid:", parseInt(pid));

        // TODO: Call stop script.
        process.kill(parseInt(pid), "SIGTERM");
    }
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

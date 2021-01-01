let { app, BrowserWindow, } = require("electron");

let window;
let lock = app.requestSingleInstanceLock()
app.on("ready", loadLogin);
app.on("window-all-closed", () => {
    app.quit()
})

if (!lock) {
    app.quit()
} else {
    app.on("second-instance", ((event, argv, cwd) => {
        if (window) {
            if (window.isMinimized()) window.restore()
            window.focus()
        }
    }))
}



function loadLogin() {
    window = new BrowserWindow({
        width: 290,
        height: 440,
        resizable: false,
        frame: false,
        transparent: true,
        alwaysOnTop: false,
        fullscreenable: false,
        maximizable: false,
        resizeable: false,
        icon: `${__dirname}/assets/logo.ico`,

        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            devTools: false
        }
    })

    window.loadFile(`${__dirname}/login/index.html`);
}
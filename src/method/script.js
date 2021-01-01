let fetch = require('node-fetch');
let { BrowserWindow } = require("electron").remote

let name = document.getElementById("middle")
name.innerText = localStorage.getItem("username")

let buttons = document.getElementsByClassName("buttons")[0];
buttons.disabled = true
buttons.style.cursor = "not-allowed"



fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${localStorage.getItem("id")}&size=110x110&format=Png&isCircular=false`).then(async(res) => {
    let json = await res.json();
    let image = document.getElementById("profile")
    image.src = json.data[0].imageUrl;

})

fetch(`https://friends.roblox.com/v1/my/friends/count`, {
    headers: {
        "Content-Type": "application/json",
        "Cookie": `.ROBLOSECURITY=${localStorage.getItem("cookie")}`
    }
}).then(async req => {
    let json = await req.json()

    console.log(json.count)

    if (json.count >= 1) {
        buttons.style.cursor = 'pointer';
        buttons.disabled = false;
    }
})



async function bulk() {
    if (!buttons.disabled) {
        buttons.style.cursor = 'pointer';
        buttons.disabled = false;
    } else return

        const win = new BrowserWindow({
        width: 326,
        height: 142,
        frame: false,
        transparent: true,
        alwaysOnTop: false,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        icon: `${__dirname}/../assets/logo.ico`,

        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            devTools: false
        }
    })
    win.loadFile(`${__dirname}/../bulk/warning/index.html`)



    win.setPosition(window.screenX, window.screenY)

    window.close()

}

function clearUsers() {
    if (!buttons.disabled) {
        buttons.style.cursor = 'pointer';
        buttons.disabled = false;
    } else return

        const win = new BrowserWindow({
        width: 326,
        height: 296,
        frame: false,
        transparent: true,
        alwaysOnTop: false,
        resizable: false,
        maximizable: false,
        fullscreenable: false,
        icon: `${__dirname}/../assets/logo.ico`,

        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            devTools: false
        }
    })
    win.loadFile(`${__dirname}/../clear/index.html`)


    win.setPosition(window.screenX, window.screenY)

    window.close()

}
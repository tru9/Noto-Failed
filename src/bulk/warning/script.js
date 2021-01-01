let { BrowserWindow } = require('electron').remote
let fetch = require("node-fetch");


async function bulk() {
    let friends = [];

    let refresh = await fetch("https://auth.roblox.com/v1/logout", {
        method: "POST",
        headers: { "Cookie": `.ROBLOSECURITY=${localStorage.getItem("cookie")}`, "Content-Type": "application/json" }
    }).then(res => {
        let token;
        if (!res.headers.get("x-csrf-token")) return token = null
        token = res.headers.get('x-csrf-token')
        return token
    })

    let url = `https://friends.roblox.com/v1/users/${localStorage.getItem("id")}/friends`;
    let req = await (await fetch(url)).json();

    runFile()


    req.data.forEach((entry) => {
        friends.push({
            id: entry.id,
            name: entry.name
        })
    })

    friends = friends.sort((a, b) => a - b)
    if (friends.length <= 0) return runFile()



    for (let element of friends) {
        setTimeout(async() => {
            let url = `https://friends.roblox.com/v1/users/${localStorage.getItem("id")}/friends`;
            let info = await (await fetch(url)).json();

            if (info.data.length <= 0) return runFile()

            let req = await fetch(`https://friends.roblox.com/v1/users/${element.id}/unfriend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": `.ROBLOSECURITY=${localStorage.getItem("cookie")}`,
                    "X-CSRF-TOKEN": refresh
                }
            })

            if ("errors" in req) return;

        }, 1000)
    }
}

function endBulk() {
    const win = new BrowserWindow({
        width: 326,
        height: 387,
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

    win.loadFile(`${__dirname}/../../method/index.html`)

    window.close()
}


function runFile() {
    const win = new BrowserWindow({
        width: 326,
        height: 387,
        resizable: false,
        frame: false,
        transparent: true,
        alwaysOnTop: false,
        fullscreenable: false,
        maximizable: false,
        resizeable: false,
        icon: `${__dirname}/../../assets/logo.ico`,

        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            devTools: false
        }
    })

    win.loadFile(`${__dirname}/../index.html`)


    window.close()
}
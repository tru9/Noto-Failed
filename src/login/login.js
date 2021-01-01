let { shell } = require("electron")
let { BrowserWindow } = require("electron").remote;
let fetch = require("node-fetch");



function help() {
    shell.openExternal("https://github.com/fxncis/Noto/blob/main/README.md").then(() => {
        window.close()
    })
}



async function validate() {
    let input = document.getElementById("cookie");


    if (input.value.length <= 0) return error(input, "Cookie has not been provided", 13);
    if (!input.value.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_")) return error(input, "Please provide a valid Cookie", 14)



    let req = await (await fetch("https://users.roblox.com/v1/users/authenticated", {
        headers: {
            "Cookie": `.ROBLOSECURITY=${input.value}`
        }
    })).json()

    if ("errors" in req) return error(input, "Cookie validation failed")

    localStorage.setItem("id", req.id);
    localStorage.setItem("cookie", input.value);
    localStorage.setItem("username", req.name)


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
            devTools: true
        }
    })

    await win.loadFile(`${__dirname}/../method/index.html`)

    window.close()
}


function error(input, value, size) {
    input.value = "";

    if (size) document.querySelector("input").style.setProperty("--size", `${size}px`)
    input.placeholder = value;

}
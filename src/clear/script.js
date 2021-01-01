let fetch = require("node-fetch")
let { BrowserWindow } = require('electron').remote

let username = document.getElementById("user")
let profile = document.getElementById("profile")
let position = -0;
let removed = 0;

localStorage.setItem("removed", 0)


let pass = document.getElementsByClassName("pass")[0];
let check = document.getElementsByClassName("check")[0];

check.style.cursor = "not-allowed"
pass.style.cursor = "not-allowed"


getUsers().then(async(r) => {
    let defaultUser = r[0];
    let thumbUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${defaultUser.id}&size=110x110&format=Png&isCircular=false`
    let thumb = await (await fetch(thumbUrl)).json()

    position = r.indexOf(defaultUser);

    username.innerText = defaultUser.name;
    profile.src = thumb.data[0].thumbUrl

    check.style.cursor = "pointer"
    pass.style.cursor = "pointer"
})


async function getUsers() {
    let url = `https://friends.roblox.com/v1/users/${localStorage.getItem("id")}/friends`;
    let req = await (await fetch(url)).json();
    let friends = [];

    if ("errors" in req) return null

    for (const entry of req.data) {
        friends.push({
            id: entry.id,
            name: entry.name,
        })
    }

    friends = friends.sort((a, b) => a - b)
    if (friends.length <= 0) return closeWin()

    return friends
}

document.getElementsByClassName("pass")[0].addEventListener("click", async() => {
    if (check.disabled || pass.disabled) return;
    check.disabled = true;
    pass.disabled = true;


    check.style.cursor = "not-allowed"
    pass.style.cursor = "not-allowed"


    setTimeout(async() => {
        let users = await getUsers();

        let newUser = users[position + 1]
        position++;

        let thumbUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${newUser.id}&size=110x110&format=Png&isCircular=false`
        let thumb = await (await fetch(thumbUrl)).json()

        username.innerText = newUser.name;
        profile.src = thumb.data[0].imageUrl;

        check.style.cursor = "pointer"
        pass.style.cursor = "pointer"

        check.disabled = false;
        pass.disabled = false;
    }, 3000)
})


check.addEventListener("click", async() => {
    if (check.disabled || pass.disabled) return;
    check.disabled = true;
    pass.disabled = true;

    check.style.cursor = "not-allowed"
    pass.style.cursor = "not-allowed"


    setTimeout(async() => {
        let users = await getUsers();

        let currentUser = users[position];
        let newUser = users[position + 1];
        position++;


        await (await fetch(`https://friends.roblox.com/v1/users/${currentUser.id}/unfriend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `.ROBLOSECURITY=${localStorage.getItem("cookie")}`,
                "X-CSRF-TOKEN": await getToken()
            }
        }))

        removed++
        if (!newUser) return closeWin()

        let thumbUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${newUser.id}&size=110x110&format=Png&isCircular=false`
        let thumb = await (await fetch(thumbUrl)).json()

        if ("errors" in thumb || !thumb.data) check.disabled = true


        username.innerText = newUser.name;
        profile.src = thumb.data[0].imageUrl;

        check.style.cursor = "pointer"
        pass.style.cursor = "pointer"

        check.disabled = false;
        pass.disabled = false;
    }, 4000)
})

function getToken() {
    return fetch("https://auth.roblox.com/v1/logout", {
        method: 'POST',
        headers: {
            "Cookie": `.ROBLOSECURITY=${localStorage.getItem("cookie")}`,
            "Content-Type": 'application/json'
        }
    }).then(res => {
        let token;
        if (!res.headers.get("x-csrf-token")) return token = null
        token = res.headers.get('x-csrf-token')
        return token
    })
}

async function closeWin() {
    const win = new BrowserWindow({
        width: 326,
        height: 142,
        frame: false,
        transparent: true,
        alwaysOnTop: false,
        fullscreenable: false,
        resizable: false,
        maximizable: false,
        icon: `${__dirname}/../assets/logo.ico`,

        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
    })

    win.loadFile(`${__dirname}/./success/index.html`)

    window.close()
}
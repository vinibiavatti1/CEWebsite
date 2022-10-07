const REFRESH_DELAY_MS = 10 * 1000;
const EU_SERVER = 1;
const US_SERVER = 2;
let lastUpdate = new Date()

function init() {
    refreshServerList();
    setInterval(refreshServerList, REFRESH_DELAY_MS);
}

function refreshServerList() {
    refreshServerStatus(EU_SERVER, () => {
        refreshServerStatus(US_SERVER);
    });
    lastUpdate = new Date()
    let year = lastUpdate.getFullYear();
    let month = lastUpdate.getMonth() + 1;
    let day = lastUpdate.getDay();
    let hour = lastUpdate.getHours();
    let minutes = lastUpdate.getMinutes();
    let seconds = lastUpdate.getSeconds();
    document.getElementById("last-update").innerHTML = `${year}/${month}/${day} ${hour}:${minutes}:${seconds} GMT`
}

function refreshServerStatus(number, callback) {
    prefix = `s${number}`;
    let url = "https://cenation.co.uk/status.php";
    if (number == US_SERVER) {
        url = "https://cenation.co.uk/status2.php";
    }
    fetch(url)
    .then((response) => response.text())
    .then((response) => {
        let lines = response.split('\n');
        let status = lines[9].replace('Status: ', '').trim();
        if (status == 'Online') {
            let players = lines[10].replace('Players: ', '').trim();
            let playersOnline = players.split('/')[0].trim();
            let playerAmount = players.split('/')[1].trim();
            let map = lines[11].replace('Map: ', '').trim();
            let mode = lines[12].replace('Mode: ', '').trim();
            if (mode == 'ctf') {
                mode = mode.toUpperCase();
            }
            updateServerField(`${prefix}-status`, status);
            updateServerField(`${prefix}-players-online`, playersOnline);
            updateServerField(`${prefix}-players-amount`, playerAmount);
            updateServerField(`${prefix}-map`, map);
            updateServerField(`${prefix}-mode`, mode);
            document.getElementById(`${prefix}-status`).classList.remove(`text-bg-success`);
            document.getElementById(`${prefix}-status`).classList.remove(`text-bg-danger`);
            document.getElementById(`${prefix}-status`).classList.add(`text-bg-success`);
        } else {
            updateServerField(`${prefix}-status`, status);
            updateServerField(`${prefix}-players-online`, `--`);
            updateServerField(`${prefix}-players-amount`, `--`);
            updateServerField(`${prefix}-map`, `--`);
            updateServerField(`${prefix}-mode`, `--`);
            document.getElementById(`${prefix}-status`).classList.remove(`text-bg-success`);
            document.getElementById(`${prefix}-status`).classList.remove(`text-bg-danger`);
            document.getElementById(`${prefix}-status`).classList.add(`text-bg-danger`);
        }
        if (callback) {
            callback();
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

function updateServerField(id, value) {
    document.getElementById(id).innerHTML = value;
}

document.addEventListener('scroll', (a) => {
    let navbar = document.getElementById("navbar");
    let btnTop = document.getElementById("btn-top");
    let scroll = document.documentElement.scrollTop;
    if (scroll < 100) {
        navbar.classList.remove('navbar-down');
        navbar.classList.add('navbar-up');
        btnTop.classList.add('d-none');
    } else {
        navbar.classList.remove('navbar-up');
        navbar.classList.add('navbar-down');
        btnTop.classList.remove('d-none');
    }
});

init();
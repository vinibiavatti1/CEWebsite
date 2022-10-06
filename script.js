const REFRESH_DELAY_MS = 10 * 1000;
const EU_SERVER = 1;
const US_SERVER = 2;
let lastUpdate = new Date()

function init() {
    refreshServerList();
    setInterval(refreshServerList, REFRESH_DELAY_MS);
}

function refreshServerList() {
    refreshServerStatus(EU_SERVER);
    refreshServerStatus(US_SERVER);
}

function refreshServerStatus(number) {
    prefix = `s${number}-`;
    let url = "https://cenation.co.uk/status.php";
    if (number == US_SERVER) {
        url = "https://cenation.co.uk/status2.php";
    }
    fetch(url)
    .then((response) => response.text())
    .then((response) => {
        let lines = response.split('\n');
        let status = lines[2].replace('Status: ', '');
        if (status == 'Online') {
            let players = lines[3].replace('Players: ', '');
            let playersOnline = players.split('/')[0];
            let playerAmount = players.split('/')[1];
            let map = lines[4].replace('Map: ', '');
            let mode = lines[5].replace('Mode: ', '');
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
    })
    .catch((error) => {
        console.error(error);
    })
    .finally(() => {
        lastUpdate = new Date()
        let year = lastUpdate.getFullYear();
        let month = lastUpdate.getMonth() + 1;
        let day = lastUpdate.getDay();
        let hour = lastUpdate.getHours();
        let minutes = lastUpdate.getMinutes();
        let seconds = lastUpdate.getSeconds();
        document.getElementById("last-update").innerHTML = `${year}/${month}/${day} ${hour}:${minutes}:${seconds} GMT`
    })
}

function updateServerField(id, value) {
    document.getElementById(id).innerHTML = value;
}

init();
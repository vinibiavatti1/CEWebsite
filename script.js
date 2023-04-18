const MOCK_DATA = true;
const REFRESH_DELAY_SECONDS = 60;
const SERVERS = [
    { id: 1, name: "Europe (Netherlands)", address: "89.38.98.12:24711", statusUrl: "https://cenation.co.uk/status.php", mockStatusUrl: "./mock.txt" },
]

let lastUpdate = new Date()

function init() {
    if (window.location.hostname) {
        refreshServerList();
        setInterval(refreshServerList, REFRESH_DELAY_SECONDS * 1000);
    }
    initGallery();
    setUpdateRate();
    setupScrollEventListener();
}

function clearServerList() {
    document.getElementById("server-list").innerHTML = '';
}

function refreshServerList() {
    clearServerList();
    SERVERS.forEach(server => {
        refreshServer(server);
    });
    refreshUpdateTime();
}

function refreshUpdateTime() {
    lastUpdate = new Date()
    let year = lastUpdate.getFullYear();
    let month = padZero(lastUpdate.getMonth() + 1);
    let day = padZero(lastUpdate.getDate());
    let hour = padZero(lastUpdate.getHours());
    let minutes = padZero(lastUpdate.getMinutes());
    let seconds = padZero(lastUpdate.getSeconds());
    document.getElementById("last-update").innerHTML = `${year}/${month}/${day} ${hour}:${minutes}:${seconds} GMT`
}

function refreshServer(server) {
    let template = $("#server-record-template").html();
    fetch(MOCK_DATA ? server.mockStatusUrl : server.statusUrl)
        .then((response) => response.text())
        .then((response) => {
            let lines = response.split('\n');
            let status = lines[9].replace('Status: ', '').trim();
            let players = '--'
            let playersOnline = '--'
            let playerAmount = '--'
            let map = '--'
            let mode = '--'
            if (status == 'Online') {
                players = lines[10].replace('Players: ', '').trim();
                playersOnline = players.split('/')[0].trim();
                playerAmount = players.split('/')[1].trim();
                map = lines[11].replace('Map: ', '').trim();
                mode = lines[12].replace('Mode: ', '').trim();
                if (mode == 'ctf') {
                    mode = mode.toUpperCase();
                }
            }
            template = template.replaceAll('{{ID}}', server.id);
            template = template.replaceAll('{{ID}}', server.id);
            template = template.replaceAll('{{NAME}}', server.name);
            template = template.replaceAll('{{ADDRESS}}', server.address);
            template = template.replaceAll('{{STATUS}}', status);
            template = template.replaceAll('{{ONLINE_PLAYERS}}', playersOnline);
            template = template.replaceAll('{{MAX_PLAYERS}}', playerAmount);
            template = template.replaceAll('{{MAP}}', map);
            template = template.replaceAll('{{MODE}}', mode);
            template = template.replaceAll('{{STATUS_COLOR}}', status == 'Online' ? 'text-bg-success' : 'text-bg-danger');
            $("#server-list").append(template);
        })
        .catch((error) => {
            console.error(error);
        });
}

function initGallery() {
    Galleria.loadTheme('https://cdnjs.cloudflare.com/ajax/libs/galleria/1.6.1/themes/folio/galleria.folio.min.js');
    Galleria.run('.galleria');
}

function copyToClipboard(id) {
    let content = document.getElementById(id).innerHTML;
    navigator.clipboard.writeText(content);
    alert(`Address "${content}" copied to clipboard!`)
}

function setUpdateRate() {
    document.getElementById("update-rate").innerHTML = REFRESH_DELAY_SECONDS;
}

function setupScrollEventListener() {
    document.addEventListener('scroll', (a) => {
        let navbar = document.getElementById("navbar");
        let btnTop = document.getElementById("btn-top");
        let scroll = document.documentElement.scrollTop;
        if (scroll < 100) {
            navbar.classList.remove('navbar-down');
            navbar.classList.add('navbar-up');
            $(btnTop).fadeOut();
        } else {
            navbar.classList.remove('navbar-up');
            navbar.classList.add('navbar-down');
            $(btnTop).fadeIn();
        }
    });
}

function padZero(value) {
    if (`${value}`.length == 1) {
        return '0' + value;
    }
    return value;
}

init();
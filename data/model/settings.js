const fs = require('fs');

let settings = {
    letterCooldown: 30,
    wordCooldown: 90,
    subOnly: false,
    autoPlay: false,
    autoPlayTime: 5
};

function loadSettings(id) {
    const dir = `./private/${id}`;
    const file = `${dir}/settings.json`
    if (!fs.existsSync(file)){
        fs.mkdirSync(dir);
        fs.writeFile(file, JSON.stringify(settings, null, 4), (err) => {});
    } else {
        const settingsJson = fs.readFileSync(file, 'utf-8');
        settings = JSON.parse(settingsJson);
    }
}

function saveSettings(id) {
    const dir = `./private/${id}`;
    const file = `${dir}/settings.json`
    if (!fs.existsSync(file)){
        fs.mkdirSync(dir);
    } 
    fs.writeFile(file, JSON.stringify(settings, null, 4), (err) => {});
}

module.exports = {
    loadSettings,
    saveSettings
}
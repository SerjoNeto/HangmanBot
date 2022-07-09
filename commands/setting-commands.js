const { settingCommands } = require("../utils/commands");
const { isHangmanStarted } = require("./hangman-commands");

/**
 * Checks if setting can be changed. Some settings cannot be changed while a Hangman game is in progress.
 * @param {Object} client Twitch client
 * @param {Object} channel Twitch channel
 * @param {Object} user User who wrote the command.
 * @returns True if Hangman game is in progress so setting cannot be changed. False if setting can be changed.
 */
function canChangeSettings(client, channel, user) {
    if(isHangmanStarted()) {
        client.say(channel, `@${user["display-name"]} This setting cannot be changed during a Hangman game!`);
        return true;
    }
    return false;
}

/** Check if a message is to change the letter cooldown */
const isLetterCooldown = message => (message.startsWith(settingCommands.LETTERCOOLDOWN) && message.split(" ")[0] === settingCommands.LETTERCOOLDOWN);

/**
 * Set or get the current letter cooldown.
 * @param {props} props All the props needed
 */
const settingLetterCooldown = ({ channel, client, user, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if (message === settingCommands.LETTERCOOLDOWN) {
        client.say(channel, `@${user["display-name"]} The current letter guess cooldown is ${channelSettings.getLetterCooldown()} seconds. Use "!letter <number between 0-3600>" to change.`);
    } else if (splitMessage.length === 2) {
        if(canChangeSettings(client, channel, user)) return;
        const second = parseInt(splitMessage[1]);
        if (!isNaN(second) && channelSettings.setLetterCooldown(second)) {
            client.say(channel, `@${user["display-name"]} The new letter guess cooldown is now ${channelSettings.getLetterCooldown()} seconds.`);
        }
    }
}

/** Check if a message is to change the word cooldown */
const isWordCooldown = message => (message.startsWith(settingCommands.WORDCOOLDOWN) && message.split(" ")[0] === settingCommands.WORDCOOLDOWN);

/**
 * Set or get the current word cooldown.
 * @param {props} props All the props needed
 */
const settingWordCooldown = ({ channel, client, user, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if (message === settingCommands.WORDCOOLDOWN) {
        client.say(channel, `@${user["display-name"]} The current word guess cooldown is ${channelSettings.getWordCooldown()} seconds. Use "!word <number between 0-3600>" to change.`);
    } else if (splitMessage.length === 2) {
        if(canChangeSettings(client, channel, user)) return;
        const second = parseInt(splitMessage[1]);
        if (!isNaN(second) && channelSettings.setWordCooldown(second)) {
            client.say(channel, `@${user["display-name"]} The new word guess cooldown is now ${channelSettings.getWordCooldown()} seconds.`);
        }
    }
}

/** Check if a message is to change the sub-only state */
const isSubOnly = message =>  (message.startsWith(settingCommands.SUBONLY) && message.split(" ")[0] === settingCommands.SUBONLY);

/**
 * Set or get the current sub-only state.
 * @param {props} props All the props needed
 */
const settingSubOnly = ({ channel, client, user, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if(message === settingCommands.SUBONLY) {
        const subOnlyState = channelSettings.getSubOnly() ? "ON" : "OFF";
        client.say(channel, `@${user["display-name"]} Hangman sub only mode is ${subOnlyState}. Use "!subonly <on/off>" to change.`);
    } else if (splitMessage.length === 2 && splitMessage[1] === "off") {
        if (channelSettings.setSubOnly(false)) {
            client.say(channel, `@${user["display-name"]} Hangman sub only mode is turned OFF.`);
        }
    } else if (splitMessage.length === 2 && splitMessage[1] === "on") {
        if (channelSettings.setSubOnly(true)) {
            client.say(channel, `@${user["display-name"]} Hangman sub only mode is turned ON.`);
        }
    }
}

/** Check if a message is to change the auto play state */
const isAuto = message =>  (message.startsWith(settingCommands.AUTO) && message.split(" ")[0] === settingCommands.AUTO);

/**
 * Set or get the current auto play state
 * @param {props} props All the props needed
 */
const settingAuto = ({ channel, client, user, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if(message === settingCommands.AUTO) {
        const autoState = channelSettings.getAuto() ? "ON" : "OFF";
        client.say(channel, `@${user["display-name"]} Auto play mode is ${autoState}. Use "!auto <on/off>" to change.`);
    } else if (splitMessage.length === 2 && splitMessage[1] === "off") {
        if (channelSettings.setAuto(false)) {
            client.say(channel, `@${user["display-name"]} Auto play mode is turned OFF.`);
        }
    } else if (splitMessage.length === 2 && splitMessage[1] === "on") {
        if (channelSettings.setAuto(true)) {
            client.say(channel, `@${user["display-name"]} Auto play mode is turned ON.`);
        }
    }
}

const showSettings = ({ channel, client, user, channelSettings }) => {
    client.say(channel, `@${user["display-name"]} ${channelSettings.printSettings()}`);
}

module.exports = {
    isLetterCooldown,
    settingLetterCooldown,
    isWordCooldown,
    settingWordCooldown,
    isSubOnly,
    settingSubOnly,
    isAuto,
    settingAuto,
    showSettings
}
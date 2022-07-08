const { settingCommands } = require("../utils/commands");
const { isHangmanStarted } = require("./hangman-commands");

function canChangeSettings(client, channel, user) {
    if(isHangmanStarted()) {
        client.say(channel, `@${user["display-name"]} This setting cannot be changed during a Hangman game!`);
        return true;
    }
}

/** Check if a message is to change the letter cooldown */
const isLetterCooldown = message => (message.startsWith(settingCommands.LETTERCOOLDOWN) && message.split(" ")[0] === settingCommands.LETTERCOOLDOWN);

/**
 * Set or get the current letter cooldown.
 * @param {props} props All the props needed
 */
const settingLetterCooldown = ({ channel, client, user, id, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if (message === settingCommands.LETTERCOOLDOWN) {
        client.say(channel, `@${user["display-name"]} The current letter cooldown guess is ${channelSettings.getLetterCooldown()} seconds. Use "!letter <number between 0-3600>" to change the letter cooldown seconds!`);
    } else if (splitMessage.length === 2) {
        if(canChangeSettings(client, channel, user)) return;
        const second = parseInt(splitMessage[1]);
        if (!isNaN(second) && channelSettings.setLetterCooldown(second, id)) {
            client.say(channel, `@${user["display-name"]} The new letter cooldown guess is now ${channelSettings.getLetterCooldown()} seconds.`);
        }
    }
}

/** Check if a message is to change the word cooldown */
const isWordCooldown = message => (message.startsWith(settingCommands.WORDCOOLDOWN) && message.split(" ")[0] === settingCommands.WORDCOOLDOWN);

/**
 * Set or get the current word cooldown.
 * @param {props} props All the props needed
 */
const settingWordCooldown = ({ channel, client, user, id, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if (message === settingCommands.WORDCOOLDOWN) {
        client.say(channel, `@${user["display-name"]} The current letter cooldown guess is ${channelSettings.getWordCooldown()} seconds. Use "!word <number between 0-3600>" to change the word cooldown seconds!`);
    } else if (splitMessage.length === 2) {
        if(canChangeSettings(client, channel, user)) return;
        const second = parseInt(splitMessage[1]);
        if (!isNaN(second) && channelSettings.setWordCooldown(second, id)) {
            client.say(channel, `@${user["display-name"]} The new letter cooldown guess is now ${channelSettings.getWordCooldown()} seconds.`);
        }
    }
}

/** Check if a message is to change the sub-only state */
const isSubOnly = message =>  (message.startsWith(settingCommands.SUBONLY) && message.split(" ")[0] === settingCommands.SUBONLY);

/**
 * Set or get the current sub-only state.
 * @param {props} props All the props needed
 */
const settingSubOnly = ({ channel, client, user, id, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if(message === settingCommands.SUBONLY) {
        const subOnlyState = channelSettings.getSubOnly() ? "ON" : "OFF";
        client.say(channel, `@${user["display-name"]} Hangman sub only mode is ${subOnlyState}. Use "!subonly <on/off>" to change if only subs can play Hangman!`);
    } else if (splitMessage.length === 2 && splitMessage[1] === "off") {
        const success = channelSettings.setSubOnly(false, id);
        if (success) {
            client.say(channel, `@${user["display-name"]} Hangman sub only mode is turned OFF.`);
        }
    } else if (splitMessage.length === 2 && splitMessage[1] === "on") {
        const success = channelSettings.setSubOnly(true, id);
        if (success) {
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
const settingAuto = ({ channel, client, user, id, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if(message === settingCommands.AUTO) {
        const autoState = channelSettings.getAuto() ? "ON" : "OFF";
        client.say(channel, `@${user["display-name"]} Auto play mode is ${autoState}. Use "!auto <on/off>" to change if Hangman games automatically start after one is finished!`);
    } else if (splitMessage.length === 2 && splitMessage[1] === "off") {
        const success = channelSettings.setAuto(false, id);
        if (success) {
            client.say(channel, `@${user["display-name"]} Auto play mode is turned OFF.`);
        }
    } else if (splitMessage.length === 2 && splitMessage[1] === "on") {
        const success = channelSettings.setAuto(true, id);
        if (success) {
            client.say(channel, `@${user["display-name"]} Auto mode is turned ON.`);
        }
    }
}

const showSettings = ({ channel, client, user, id, channelSettings }) => {
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
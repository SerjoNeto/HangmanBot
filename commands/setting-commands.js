const { settingCommands } = require("../utils/commands");

/**
 * Checks if setting can be changed. Some settings cannot be changed while a Hangman game is in progress.
 * @param {Object} client Twitch client
 * @param {Object} channel Twitch channel
 * @param {Object} user User who wrote the command.
 * @returns True if Hangman game is in progress so setting cannot be changed. False if setting can be changed.
 */
function canChangeSettings(client, channel, user, channelHangman) {
    if(channelHangman.getStarted()) {
        client.say(channel, `@${user["display-name"]} This setting cannot be changed during a Hangman game! End the game with '!end' then try again.`);
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
const settingLetterCooldown = ({ channel, client, user, channelSettings, channelHangman, message }) => {
    const splitMessage = message.split(" ");
    if (message === settingCommands.LETTERCOOLDOWN) {
        client.say(channel, `@${user["display-name"]} The current letter guess cooldown is ${channelSettings.getLetterCooldown()} seconds. Use "!letter <number between 0-3600>" to change.`);
    } else if (splitMessage.length === 2) {
        if(canChangeSettings(client, channel, user, channelHangman)) return;
        const second = parseInt(splitMessage[1]);
        if (!isNaN(second) && channelSettings.setLetterCooldown(second)) {
            client.say(channel, `@${user["display-name"]} The new letter guess cooldown is now ${channelSettings.getLetterCooldown()} seconds.`);
        } else {
            client.say(channel, `@${user["display-name"]} Invalid "!letter <number between 0-3600>" usage.`);
        }
    }
}

/** Check if a message is to change the word cooldown */
const isWordCooldown = message => (message.startsWith(settingCommands.WORDCOOLDOWN) && message.split(" ")[0] === settingCommands.WORDCOOLDOWN);

/**
 * Set or get the current word cooldown.
 * @param {props} props All the props needed
 */
const settingWordCooldown = ({ channel, client, user, channelSettings, channelHangman, message }) => {
    const splitMessage = message.split(" ");
    if (message === settingCommands.WORDCOOLDOWN) {
        client.say(channel, `@${user["display-name"]} The current word guess cooldown is ${channelSettings.getWordCooldown()} seconds. Use "!word <number between 0-3600>" to change.`);
    } else if (splitMessage.length === 2) {
        if(canChangeSettings(client, channel, user, channelHangman)) return;
        const second = parseInt(splitMessage[1]);
        if (!isNaN(second) && channelSettings.setWordCooldown(second)) {
            client.say(channel, `@${user["display-name"]} The new word guess cooldown is now ${channelSettings.getWordCooldown()} seconds.`);
        } else {
            client.say(channel, `@${user["display-name"]} Invalid "!word <number between 0-3600>" usage.`);
        }
    }
}

/** Check if a message is to change the auto play timer cooldown */
const isAutoPlayTimer = message => (message.startsWith(settingCommands.AUTOTIMER) && message.split(" ")[0] === settingCommands.AUTOTIMER);

/**
 * Set or get the current auto play timer.
 * @param {props} props All the props needed
 */
 const settingAutoPlayTimer = ({ channel, client, user, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if (message === settingCommands.AUTOTIMER) {
        client.say(channel, `@${user["display-name"]} The current auto-play start timer is ${channelSettings.getAutoPlayTimer()} seconds. Use "${settingCommands.AUTOTIMER} <number between 0-3600>" to change.`);
    } else if (splitMessage.length === 2) {
        const second = parseInt(splitMessage[1]);
        if (!isNaN(second) && channelSettings.setAutoPlayTimer(second)) {
            client.say(channel, `@${user["display-name"]} The new auto-play start timer is now ${channelSettings.getAutoPlayTimer()} seconds. This change will take effect at the end of the current/next game.`);
        } else {
            client.say(channel, `@${user["display-name"]} Invalid ${settingCommands.AUTOTIMER} "<number between 0-3600>" usage.`);
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
        } else {
            client.say(channel, `@${user["display-name"]} Hangman sub only mode is already turned OFF.`);
        }
    } else if (splitMessage.length === 2 && splitMessage[1] === "on") {
        if (channelSettings.setSubOnly(true)) {
            client.say(channel, `@${user["display-name"]} Hangman sub only mode is turned ON.`);
        } else {
            client.say(channel, `@${user["display-name"]} Hangman sub only mode is already turned ON.`);
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
        } else {
            client.say(channel, `@${user["display-name"]} Auto play mode mode is already turned OFF.`);
        }
    } else if (splitMessage.length === 2 && splitMessage[1] === "on") {
        if (channelSettings.setAuto(true)) {
            client.say(channel, `@${user["display-name"]} Auto play mode is turned ON.`);
        } else {
            client.say(channel, `@${user["display-name"]} Auto play mode mode is already turned ON.`);
        }
    }
}

/** Check if error messages are displayed for failed Hangman guesses. */
const isError = message =>  (message.startsWith(settingCommands.ERROR) && message.split(" ")[0] === settingCommands.ERROR);

/**
 * Set or get the current error message display
 * @param {props} props All the props needed
 */
const settingError = ({ channel, client, user, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if(message === settingCommands.ERROR) {
        const errorState = channelSettings.getError() ? "ON" : "OFF";
        client.say(channel, `@${user["display-name"]} Error messages are turned ${errorState}. Use "!error <on/off>" to change.`);
    } else if (splitMessage.length === 2 && splitMessage[1] === "off") {
        if (channelSettings.setError(false)) {
            client.say(channel, `@${user["display-name"]} Error messages are turned OFF.`);
        } else {
            client.say(channel, `@${user["display-name"]} Error messages are already turned OFF.`);
        }
    } else if (splitMessage.length === 2 && splitMessage[1] === "on") {
        if (channelSettings.setError(true)) {
            client.say(channel, `@${user["display-name"]} Error messages are turned ON.`);
        } else {
            client.say(channel, `@${user["display-name"]} Error messages are already turned ON.`);
        }
    }
}

/** Checks if the user wants to get or set a custom win message. */
const isWinMessage = message => (message.startsWith(settingCommands.WINMESSAGE) && message.split(" ")[0] === settingCommands.WINMESSAGE);

/**
 * Set or get the current custom win message for winning a Hangman game.
 * @param {props} proprs All the props needed 
 */
const settingWinMessage = ({ channel, client, user, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if (message === settingCommands.WINMESSAGE) {
        // Get the current win message.
        const winMsg = channelSettings.getWinMessage();
        if (winMsg === null) {
            client.say(channel, `@${user["display-name"]} There is currently no custom Hangman win message. You can set one with "!winmessage <message>, and type "$user" in the message for the winner's username.`);
        } else {
            client.say(channel, `@${user["display-name"]} The current custom Hangman win message is: "${winMsg}".`);
        }
    } else if (splitMessage.length >= 2) {
        // Set a new custom message. I really hope there's no string injection problems here.
        const newWinMsg = message.substr(message.indexOf(" ") + 1);
        channelSettings.setWinMessage(newWinMsg);
        client.say(channel, `@${user["display-name"]} The custom Hangman win message is now "${newWinMsg}".`);
    }
}

/**
 * Deletes the current custom win message.
 * @param {props} proprs All the props needed 
 */
const clearingWinMessage = ({ channel, client, user, channelSettings }) => {
    channelSettings.clearWinMessage();
    client.say(channel, `@${user["display-name"]} The custom win message has been deleted!`);
}

/**
 * Prints out all the settings.
 * @param {props} props All the props needed
 */
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
    isAutoPlayTimer,
    settingAutoPlayTimer,
    isError,
    settingError,
    isWinMessage,
    settingWinMessage,
    clearingWinMessage,
    showSettings
}
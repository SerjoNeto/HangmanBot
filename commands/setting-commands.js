const { settingCommands } = require("../utils/commands");

/** Check if a message is to change the letter cooldown */
const isLetterCooldown = message => (message.startsWith(settingCommands.LETTERCOOLDOWN) && message.split(" ")[0] === settingCommands.LETTERCOOLDOWN);

/**
 * Set or get the current letter cooldown.
 * @param {props} props All the props needed
 */
const settingLetterCooldown = ({ channel, client, user, id, channelSettings, message }) => {
    const splitMessage = message.split(" ");
    if (message === settingCommands.LETTERCOOLDOWN) {
        client.say(channel, `@${user["display-name"]} The current letter cooldown guess is ${channelSettings.getLetterCooldown()} seconds.`);
    } else if (splitMessage.length === 2) {
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
        client.say(channel, `@${user["display-name"]} The current letter cooldown guess is ${channelSettings.getWordCooldown()} seconds.`);
    } else if (splitMessage.length === 2) {
        const second = parseInt(splitMessage[1]);
        if (!isNaN(second) && channelSettings.setWordCooldown(second, id)) {
            client.say(channel, `@${user["display-name"]} The new letter cooldown guess is now ${channelSettings.getWordCooldown()} seconds.`);
        }
    }
}

module.exports = {
    isLetterCooldown,
    settingLetterCooldown,
    isWordCooldown,
    settingWordCooldown
}
const { mainCommands } = require('../utils/commands');
const { hasId, addName } = require('../data/name-functions')
const { createNewHangmanClient } = require('./new-hangman-client')

const addHangmanClient = ({ client, channel, name, id }) => {
	// TODO: Spam checker. Two minute cooldown between each add.

	// Check if user already exists.
	if (hasId(id)) {
		client.say(channel, `@${name}, you have already been added!`);
		return;
	}
	// Add user and create new tmi.js client for them.
	addName(id, name);
	createNewHangmanClient(name);
	client.say(channel, `Congrats @${name}, PlayHangmanBot has been successfully added to your channel!`);
};

module.exports = {
	addHangmanClient
};
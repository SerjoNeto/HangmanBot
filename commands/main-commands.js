const { mainCommands } = require('../utils/commands');
const { hasId, getName, addName, deleteName, transferName } = require('../data/model/name-functions');
const { createNewHangmanClient } = require('./new-hangman-client');

/**
  * List of params below.
  *
  * @param client Main PlayHangmanBot client.
  * @param channel PlayHangmanBot channel to reply messages to.
  * @param name Twitch username of channel wanted to add Hangman.
  * @param id Unique Twitch ID to positively identify since name can be changed.
  */

// List of live clients. Key = id, Value = client.
const liveHangmanClients = {};

// Adds a Hangman Game to channel [name]. 
const addHangmanClient = ({ client, channel, name, id }) => {
	// TODO: Spam checker. Two minute cooldown between each add.

	// Check if user already exists.
	if (id in liveHangmanClients) {
		client.say(channel, `@${name}, you have already been added!`);
		return;
	}
	// Add user, create new tmi.js client, and add to list of live clients.
	addName(id, name);
	const hangmanClient = createNewHangmanClient(name);
	liveHangmanClients[id] = hangmanClient;
	client.say(channel, `Congrats @${name}, the Hangman Bot has been successfully added to your channel!`);
};

// Removes live Hangman Game from channel [name].
const removeHangmanClient = ({ client, channel, name, id }) => {
	// Checks if Hangman client needs to be removed.
	if(!(id in liveHangmanClients)) {
		client.say(channel, `@${name}, you do not have a Hangman Bot running.`);
		return;
	}

	// Disconnects the client and removes from list of live clients.
	liveHangmanClients[id].disconnect();
	delete liveHangmanClients[id];
	deleteName(id);
	client.say(channel, `@${name}, the Hangman Bot has been successfully removed from your channel.`)
};

// Used if user changed Twitch username (even capitalizations). Transfer names over.
const transferHangmanClient = ({ client, channel, name, id }) => {
	if ((id in liveHangmanClients) && hasId(id) && getName(id) !== name) {
		// Can transfer account to new username, so do it.
		const transferClient = liveHangmanClients[id];
		const oldId = getName(id);
		transferClient.join(name);
		transferClient.part(oldId);
		transferName(id, name);
		client.say(channel, `@${name}, your Hangman Bot has been successfully transferred!`)
	} else {
		// Cannot transfer account.
		client.say(channel, `Sorry @${name}, transfer failed. Transfers can only work if you changed your Twitch username and have a previous live Hangman Bot running on your channel.`);
		return;
	}
};

// Automatically starts Hangman games for nameId
function autoStartHangmanClient( client, channel, nameId ) {
	for (const [id, name] of Object.entries(nameId)) {
		const hangmanClient = createNewHangmanClient(name);
		liveHangmanClients[id] = hangmanClient;
	}
};


module.exports = {
	addHangmanClient,
	removeHangmanClient,
	transferHangmanClient,
	autoStartHangmanClient
};
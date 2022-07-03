const tmi = require('tmi.js');
const { loadSettings } = require('../data/model/settings');
const { hangmanBotOAuth } = require('../private/password');
const { hangmanCommands } = require('../utils/commands');
const { isGuess, hangmanStart, hangmanEnd, hangmanGuess } = require('./hangman-commands')

/**
  * Creates a new Hangman client to play Hangman on.
  * @param name Twitch channel name
  */
function createNewHangmanClient(id, name) {
	loadSettings(id);

	const hangmanOptions = {
	    options: {
	        debug: true,
	    },
	    connection: {
	        cluster: 'aws',
	        reconnect: true,
	    },
	    identity: {
	        username: 'PlayHangmanBot',
	        password: hangmanBotOAuth,
	    },
	    channels: [name],
	};
	const newHangmanClient = new tmi.client(hangmanOptions);
	newHangmanClient.connect();

	// Responds when client has been successfuly created.
	newHangmanClient.on('connected', (address, port) => {
		newHangmanClient.action(name, "is live!")
	});

	// Listener for Hangman messages. 
	newHangmanClient.on('message', (channel, user, message, self) => {
		// Ignore self messages and non-commands.
		if(self || !message.startsWith("!")) return;

		const client = newHangmanClient;
		const props = { channel, client, user };

		/* Dictionary list of explicit commands */
		const chatCommands = {
			[hangmanCommands.START]: () => hangmanStart(props),
			[hangmanCommands.END]: () => hangmanEnd(props),
			[hangmanCommands.GUESS]: () => hangmanGuess({ ...props, message }),
		}

		let command;
		switch(true){
			case (isGuess(message)):
				command = '!guess';
				break;
			default:
				command = message;
				break;
		}

		/* Node versions < v14 do not support optional chaining (null safe operator) */
		if(chatCommands[command]) {
			chatCommands[command]();
		}
	});

	return newHangmanClient;
}

module.exports = {
	createNewHangmanClient
}
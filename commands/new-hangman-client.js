const tmi = require('tmi.js');
const { hangmanBotOAuth } = require('../private/password');

/**
  * Creates a new Hangman client to play Hangman on.
  * @param name Twitch channel name
  */
function createNewHangmanClient(name) {
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

		if(message.toLowerCase() === '!hello') {
		   newHangmanClient.say(channel, `@${user.username}, heya!`);
		}
	});
	return newHangmanClient;
}

module.exports = {
	createNewHangmanClient
}
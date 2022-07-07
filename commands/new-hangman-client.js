const tmi = require('tmi.js');
const fs = require('fs');
const { ChannelSettings } = require('../data/model/settings');
const { hangmanBotOAuth } = require('../private/password');
const { hangmanCommands, settingCommands } = require('../utils/commands');
const { isGuess, hangmanStart, hangmanEnd, hangmanGuess } = require('./hangman-commands');
const { isAdmin } = require('../utils/users');
const { settingLetterCooldown, isLetterCooldown, isWordCooldown, settingWordCooldown, settingSubOnly, isSubOnly, isAuto, settingAuto, showSettings } = require('./setting-commands');

/**
  * Creates a new Hangman client to play Hangman on.
  * @param name Twitch channel name
  */
function createNewHangmanClient(id, name) {
	// Create folder in logs
	const dir = `./logs/${id}`
	if(!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	// Make a settings class to keep track of channel settings
	const channelSettings = new ChannelSettings();
	channelSettings.loadSettings(id);

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

		// Admin commands only. Mostly just settings.
		if (isAdmin(user)) {
			const adminProps = { channel, client, user, id, channelSettings }
			const adminCommands = {
				[settingCommands.LETTERCOOLDOWN]: () => settingLetterCooldown({ ...adminProps, message }),
				[settingCommands.WORDCOOLDOWN]: () => settingWordCooldown({...adminProps, message }),
				[settingCommands.SUBONLY]: () => settingSubOnly({ ...adminProps, message }),
				[settingCommands.AUTO]: () => settingAuto({ ...adminProps, message }),
				[settingCommands.SETTINGS]: () => showSettings({ ...adminProps })
			}

			let settingCommand;
			switch(true){
				case (isLetterCooldown(message)):
					settingCommand = '!letter';
					break;
				case (isWordCooldown(message)):
					settingCommand = `!word`
					break;
				case (isSubOnly(message)):
					settingCommand = `!subonly`
					break;
				case (isAuto(message)):
					settingCommand = `!auto`
					break;
				default:
					settingCommand = message;
					break;
			}
			if(adminCommands[settingCommand]) {
				adminCommands[settingCommand]();
			}
		}

		// Commands for everybody
		const hangmanProps = { channel, client, user };
		const chatCommands = {
			[hangmanCommands.START]: () => hangmanStart(hangmanProps),
			[hangmanCommands.END]: () => hangmanEnd(hangmanProps),
			[hangmanCommands.GUESS]: () => hangmanGuess({ ...hangmanProps, message }),
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
		if(chatCommands[command]) {
			chatCommands[command]();
		}
	});

	return newHangmanClient;
}

module.exports = {
	createNewHangmanClient
}
const tmi = require('tmi.js');
const fs = require('fs');
const log4js = require('log4js');
const { ChannelSettings } = require('../data/settings');
const { ChannelScores } = require('../data/scores');
const { ChannelHangman } = require('../data/hangman');
const { hangmanBotName, hangmanBotOAuth } = require('../private/password');
const { hangmanCommands, settingCommands } = require('../utils/commands');
const { isGuess, isHangmanResetScores, hangmanStart, hangmanEnd, hangmanGuess, hangmanWins, hangmanLeaderboard, hangmanStats, hangmanCurrent, hangmanHelp, hangmanResetScores, hangmanStreaks } = require('../commands/hangman-commands');
const { isAdmin } = require('../utils/users');
const { settingLetterCooldown, isLetterCooldown, isWordCooldown, settingWordCooldown, settingSubOnly, isSubOnly, isAuto, isAutoPlayTimer, settingAuto, showSettings, settingError, isError, settingAutoPlayTimer, isWinMessage, settingWinMessage, clearingWinMessage } = require('../commands/setting-commands');

log4js.configure({
	appenders: {
	  everything: {
		type: 'multiFile', base: 'logs/all/', property: 'userID', extension: '.log', maxLogSize: 10485760, backups: 1, compress: true
	  }
	},
	categories: {
	  default: { appenders: [ 'everything' ], level: 'debug'}
	}
});
/**
  * Creates a new Hangman client to play Hangman on.
  * @param name Twitch channel name
  */
function createNewHangmanClient(id, name) {
	// Create logger
	const logger = log4js.getLogger(id);
	logger.addContext('userID', id);

	// Create folder in logs
	const dir = `./logs/${id}`
	if(!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	// Make a settings class to keep track of channel settings
	const channelSettings = new ChannelSettings(id);
	channelSettings.loadSettings();

	// Make a scores class to keep track of Hangman scores
	const channelScores = new ChannelScores(id);
	channelScores.loadScores();

	// Creates a custom Hangman data class to keep track of data unique to a channel
	const channelHangman = new ChannelHangman();

	// Create the Twitch Bot client.
	const hangmanOptions = {
	    options: {
	        debug: true,
	    },
	    connection: {
	        cluster: 'aws',
	        reconnect: true,
	    },
	    identity: {
	        username: hangmanBotName,
	        password: hangmanBotOAuth,
	    },
	    channels: [name],
	};
	const newHangmanClient = new tmi.client(hangmanOptions);
	newHangmanClient.connect();

	// Listener for Hangman messages. 
	newHangmanClient.on('message', (channel, user, message, self) => {
		// Ignore self messages and non-commands while logging self messages.
		if(self) {
			logger.debug(`${user["display-name"]}: ${message}`);
			return;
		}
		if(!message.startsWith("!")) return;
		
		const client = newHangmanClient;

		// Admin commands only. Mostly just settings.
		if (isAdmin(user)) {
			const adminProps = { channel, client, user, channelSettings }
			const adminCommands = {
				[settingCommands.LETTERCOOLDOWN]: () => settingLetterCooldown({ ...adminProps, channelHangman, message }),
				[settingCommands.WORDCOOLDOWN]: () => settingWordCooldown({...adminProps, channelHangman, message }),
				[settingCommands.SUBONLY]: () => settingSubOnly({ ...adminProps, message }),
				[settingCommands.AUTO]: () => settingAuto({ ...adminProps, message }),
				[settingCommands.AUTOTIMER]: () => settingAutoPlayTimer({...adminProps, message }),
				[settingCommands.ERROR]: () => settingError({ ...adminProps, message }),
				[settingCommands.WINMESSAGE]: () => settingWinMessage({ ...adminProps, message }),
				[settingCommands.CLEARWINMESSAGE]: () => clearingWinMessage({ ...adminProps }),
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
				case (isAutoPlayTimer(message)):
					settingCommand = `!autotimer`
					break;
				case (isError(message)):
					settingCommand = `!error`
					break;
				case (isWinMessage(message)):
					settingCommand = `!winmessage`
					break;
				default:
					settingCommand = message;
					break;
			}
			if(adminCommands[settingCommand]) {
				logger.debug(`${user["display-name"]}: ${message}`);
				adminCommands[settingCommand]();
			}
		}

		// Commands for everybody
		const hangmanProps = { channel, client, user };
		const chatCommands = {
			[hangmanCommands.START]: () => hangmanStart({ ...hangmanProps, channelHangman, logger }),
			[hangmanCommands.END]: () => hangmanEnd({ ...hangmanProps, channelHangman }),
			[hangmanCommands.GUESS]: () => hangmanGuess({ ...hangmanProps, channelHangman, channelSettings, channelScores, message, logger }),
			[hangmanCommands.WINS]: () => hangmanWins({ ...hangmanProps, channelScores }),
			[hangmanCommands.STATS]: () => hangmanStats({ ...hangmanProps, channelScores} ),
			[hangmanCommands.LEADERBOARD]: () => hangmanLeaderboard({ ...hangmanProps, channelScores }),
			[hangmanCommands.HANGMAN]: () => hangmanCurrent({ ...hangmanProps, channelHangman }),
			[hangmanCommands.HELP]: () => hangmanHelp(hangmanProps),
			[hangmanCommands.RESETSCORES]: () => hangmanResetScores({ ...hangmanProps, channelScores, message, logger }),
			[hangmanCommands.STREAK]: () => hangmanStreaks({ ...hangmanProps, channelScores })
		}

		let command;
		switch(true){
			case (isGuess(message)):
				command = '!guess';
				break;
			case (isHangmanResetScores(message)):
				command = '!resetscores';
				break;
			default:
				command = message;
				break;
		}
		if(chatCommands[command]) {
			logger.debug(`${user["display-name"]}: ${message}`);
			chatCommands[command]();
		}
	});

	return newHangmanClient;
}

module.exports = {
	createNewHangmanClient
}
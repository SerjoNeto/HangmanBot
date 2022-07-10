/** List of valid PlayHangmanBot commands. */
exports.mainCommands = {
	ADD: '!add',
	REMOVE: '!remove',
	TRANSFER: '!transfer'
}

/** List of valid Hangman commands. */
exports.hangmanCommands = {
	START: '!start',
	END: '!end',
	GUESS: '!guess',
	WINS: '!wins',
	STATS: '!stats',
	LEADERBOARD: '!leaderboard',
	HELP: '!help',
	HANGMAN: '!hangman'
}

/** List of valid Hangman setting commands. */
exports.settingCommands = {
	LETTERCOOLDOWN: `!letter`,
	WORDCOOLDOWN: `!word`,
	SUBONLY: `!subonly`,
	AUTO: `!auto`,
	SETTINGS: `!settings`
}
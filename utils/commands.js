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
	HANGMAN: '!hangman',
	RESETSCORES: '!resetscores',
	RESETSCORESFULL: '!resetscores Yes I understand any deleted scores cannot be recovered.'
}

/** List of valid Hangman setting commands. */
exports.settingCommands = {
	LETTERCOOLDOWN: `!letter`,
	WORDCOOLDOWN: `!word`,
	SUBONLY: `!subonly`,
	AUTO: `!auto`,
	AUTOTIMER: `!autotimer`,
	ERROR: `!error`,
	SETTINGS: `!settings`
}
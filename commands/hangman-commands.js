const { getRandomWord } = require('../data/dictionary');
const { hangmanCommands } = require('../utils/commands');
const { ordinalSuffix, convertPercentage } = require('../utils/numbers');
const { isAdmin, isSub } = require('../utils/users');

/**
 * Reused function to start a Hangman game.
 * @param {Object} channel Channel to print game start.
 * @param {Object} client Twitch Bot client
 * @param {Object} channelHangman Channel Hangman data
 */
function startHangmanGame(channel, client, channelHangman) {
    // Resets all previous scores and data.
    channelHangman.resetCooldowns();
    channelHangman.resetLives();
    channelHangman.resetGuessed();

    // Picks a new word.
    const selectedWord = getRandomWord();
    console.log(`WORD: ${selectedWord}`);
    channelHangman.setWord(selectedWord.toUpperCase().split(''));
    channelHangman.setProgress(Array(selectedWord.length).fill('-'));
    channelHangman.setStarted(true);

    client.say(channel, `A Hangman game has started! Use "!guess <letter or word here>" to play. Progress: ${channelHangman.getProgress()}.`);
}

/**
 * Check to see if the game auto starts.
 * @param {Object} channel Channel to print game start.
 * @param {Object} client Twitch Bot client
 * @param {Object} channelHangman Channel Hangman data
 * @param {Object} channelSettings Class to call possible channel settings.
 */
function autoStartHangman(channel, client, channelHangman, channelSettings) {
    if (channelSettings.getAuto()) {
        startHangmanGame(channel, client, channelHangman);
    } else {
        channelHangman.setStarted(false);
    }
}

/**
 * Updates the Hangman score in this channel. 
 * @param {Object} channelScores Class for updating scores
 * @param {Boolean} isWin Increment win counter if win
 */
function updateScore(channelScores, isWin, name, id) {
    if (isWin) {
        channelScores.addWin(name, id);
    } else {
        channelScores.addTotal();
    }
}

/*
 * Command: !start
 * Permissions: Broadcaster and mods only.
 * Manually starts a new Hangman game for chat to play.
 */
const hangmanStart = ({ channel, client, user, channelHangman }) => {
    if(isAdmin(user)) {
        if(channelHangman.getStarted()) {
            client.say(channel, `A Hangman game is already in progress!`);
        } else {
            startHangmanGame(channel, client, channelHangman);
        }
    }
};

/*
 * Command: !end
 * Permissions: Broadcaster and mods only.
 * Manually ends a game.
 */
const hangmanEnd = ({ channel, client, user, channelHangman }) => {
    if(isAdmin(user)) {
        if(channelHangman.getStarted()) {
            channelHangman.setStarted(false);
            client.say(channel, `The Hangman game has ended.`);
        } else {
            client.say(channel, `There is no Hangman game in progress!`);
        }
    }
};

/** Checks if a message is !guess and has a guess. */
const isGuess = message => (message.startsWith(hangmanCommands.GUESS) && message.split(" ")[0] === hangmanCommands.GUESS);

/**
 * Command: !guess
 * Permissions: Everybody.
 * Guesses a letter or a word for a game.
 */
//TODO: make guesses alphabet only.
const hangmanGuess = ({ channel, client, user, channelHangman, channelSettings, channelScores, message }) => {
    let guessMessage = message.split(" ");
    if (!channelHangman.getStarted()) {
        // No Hangman game has started.
        client.say(channel, `@${user["display-name"]} There is currently no Hangman game in progress.`);
    } else if (channelSettings.getSubOnly() && !isSub(user)) {
        // Sub only mode is on and the user is not a sub.
        client.say(channel, `@${user["display-name"]} Sorry, Hangman games are currently sub only.`);
    } else if ((guessMessage.length !== 2 || (guessMessage[1].length !== 1 && guessMessage[1].length !== channelHangman.getWordLength())) || !(/^[a-zA-Z]+$/.test(guessMessage[1]))) {
        // Invalid guess.
        client.say(channel, `@${user["display-name"]} Invalid "!guess <letter/word>" usage. Possible reasons: Incorrect length, non-alphabetical characters.`);
    } else if (channelHangman.isInGuessed(guessMessage[1].toUpperCase())) {
        // Already guessed.
        client.say(channel, `@${user["display-name"]} "${guessMessage[1].toUpperCase()}" has been guessed. Lives: ${channelHangman.getLives()}. Guessed: ${channelHangman.getGuessed()}. Progress: ${channelHangman.getProgress()}.`);
    } else if (guessMessage[1].length === 1){
        // Letter

        // Check cooldown
        const userId = user["user-id"]
        const letterCooldownTime = channelHangman.getLetterCooldown(userId);
        if (letterCooldownTime > 0) {
            const timeRemaining = Math.round((letterCooldownTime - Date.now())/1000);
            client.say(channel, `@${user["display-name"]} You are on letter cooldown for ${timeRemaining} seconds!`);
            return;
        } else {
            channelHangman.setLetterCooldown(userId, Date.now() + (channelSettings.getLetterCooldown() * 1000));
        }

        // Add letter to list of guesses
        const charGuess = guessMessage[1].toUpperCase();
        channelHangman.addGuessed(charGuess);

        // Check if the letter was a correct guess.
        let times = channelHangman.checkLetterGuess(charGuess);
        if(times > 0) {
            // Correct guess.
            if(channelHangman.getWord() === channelHangman.getProgress()) {
                // Winner, so upload stats and announce win.
                updateScore(channelScores, true, user["display-name"], user["user-id"]);
                const [win, place] = channelScores.getWinsAndPlaceById(userId);
                client.say(channel, `@${user["display-name"]} You win! Word is "${channelHangman.getWord()}". You are now in ${ordinalSuffix(place)} place with ${win} wins!`);
                autoStartHangman(channel, client, channelHangman, channelSettings);
            } else {
                //Correct, but more letters to be guessed.
                client.say(channel, `@${user["display-name"]} ${times} "${charGuess}". Lives: ${channelHangman.getLives()}. Guessed: ${channelHangman.getGuessed()}. Progress: ${channelHangman.getProgress()}.`);
            }

        } else {
            // Incorrect guess.
            channelHangman.loseALive();
            if(channelHangman.getLives() === 0){
                // Game over
                updateScore(channelScores, false, user["display-name"], user["user-id"]);
                client.say(channel, `@${user["display-name"]} GAME OVER. No "${charGuess}". Guessed: ${channelHangman.getGuessed()}. Final progress: ${channelHangman.getProgress()}. Actual Word: "${channelHangman.getWord()}".`);
                autoStartHangman(channel, client, channelHangman, channelSettings);
            } else {
                // Incorrect, but there are still lives remaining.
                client.say(channel, `@${user["display-name"]} No "${charGuess}". Lives: ${channelHangman.getLives()}. Guessed: ${channelHangman.getGuessed()}. Progress: ${channelHangman.getProgress()}.`);
            }
        }
    } else if (guessMessage[1].length === channelHangman.getWordLength()) {
        // Word guess

        // Check cooldown
        const userId = user["user-id"]
        const wordCooldownTime = channelHangman.getWordCooldown(userId);
        if (wordCooldownTime > 0) {
            const timeRemaining = Math.round((wordCooldownTime - Date.now())/1000);
            client.say(channel, `@${user["display-name"]} You are on word cooldown for ${timeRemaining} seconds!`);
            return;
        } else {
            channelHangman.setWordCooldown(userId, Date.now() + (channelSettings.getWordCooldown() * 1000));
        }

        const wordGuess = guessMessage[1].toUpperCase();
        channelHangman.addGuessed(wordGuess);

        if(wordGuess === channelHangman.getWord()) {
            updateScore(channelScores, true, user["display-name"], user["user-id"]);
            const [win, place] = channelScores.getWinsAndPlaceById(userId);
            client.say(channel, `@${user["display-name"]} You win! Word is "${channelHangman.getWord()}". You are now in ${ordinalSuffix(place)} place with ${win} wins!`);
            autoStartHangman(channel, client, channelHangman, channelSettings);
        } else {
            channelHangman.loseALive();
            if(channelHangman.getLives() === 0){
                // Game over
                updateScore(channelScores, false, user["display-name"], user["user-id"]);
                client.say(channel, `@${user["display-name"]} GAME OVER. The word is not "${wordGuess}". Guessed: ${channelHangman.getGuessed()}. Final progress: ${channelHangman.getProgress()}. Actual Word: "${channelHangman.getWord()}".`);
                autoStartHangman(channel, client, channelHangman, channelSettings);
            } else {
                // Incorrect, but there are still lives remaining.
                client.say(channel, `@${user["display-name"]} The word is not "${wordGuess}". Lives: ${channelHangman.getLives()}. Guessed: ${channelHangman.getGuessed()}. Progress: ${channelHangman.getProgress()}.`);
            }
        }
    } else {
        // Should never be here, so error message.
        client.say(channel, `@${user["display-name"]} Invalid "!guess <letter/word>" usage.`);
    }
};

/**
 * Command: !wins
 * Returns the number of wins a user has and their place on their keyboard.
 */
const hangmanWins = ({ channel, client, user, id, channelScores }) => {
    const [win, place] = channelScores.getWinsAndPlaceById(id);
    if (win === 0) {
        client.say(channel, `@${user["display-name"]} You are have 0 wins!`);
    } else {
        client.say(channel, `@${user["display-name"]} You are in ${ordinalSuffix(place)} place with ${win} wins!`);
    }
};

/**
 * Command: !stats
 * Returns the number of total games played and wins on a channel.
 */
const hangmanStats = ({channel, client, user, channelScores }) => {
    const [win, total] = channelScores.getChannelWins();
    client.say(channel, `@${user["display-name"]} There is a ${convertPercentage(win, total)} win rate, with ${win} wins and ${total} total games played.`);
}

/**
 * Command: !leaderboard
 * Returns the top 10 players of Hangman on a channel.
 */
const hangmanLeaderboard = ({channel, client, user, channelScores }) => {
    const topTen = channelScores.getTopTen();
    if (topTen.length === 0) {
        client.say(channel, `@${user["display-name"]} There is currently nobody on the leaderboard.`);
    } else {
        client.say(channel, `@${user["display-name"]} TOP HANGMAN PLAYERS: ${topTen}.`);
    }
}

/**
 * Command: !hangman
 * Returns the current Hangman status on this channel.
 */
const hangmanCurrent = ({ channel, client, user, channelHangman }) => {
    if (!channelHangman.getStarted()) {
        client.say(channel, `@${user["display-name"]} There is currently no Hangman game in progress.`)
    } else {
        const guessed = channelHangman.getGuessed().length === 0 ? "None" : channelHangman.getGuessed();
        client.say(channel, `@${user["display-name"]} Lives: ${channelHangman.getLives()}. Guessed: ${guessed}. Progress: ${channelHangman.getProgress()}. Use "!guess <letter or word here>" to play.`)
    }
}

/**
 * Command: !help
 * Tells the user where they can read more about this Hangman Bot.
 */
const hangmanHelp = ({ channel, client, user }) => {
    client.say(channel, `@${user["display-name"]} https://github.com/ys8672/HangmanBot`);
}

module.exports = {
    isGuess,
	hangmanStart,
	hangmanEnd,
    hangmanGuess,
    hangmanWins,
    hangmanStats,
    hangmanLeaderboard,
    hangmanCurrent,
    hangmanHelp
};

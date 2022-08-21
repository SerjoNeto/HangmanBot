const { getRandomWord } = require('../data/dictionary');
const { hangmanCommands } = require('../utils/commands');
const { ordinalSuffix, convertPercentage } = require('../utils/numbers');
const { isAdmin, isSub } = require('../utils/users');

function startHangmanGameDelay(channel, client, channelHangman, channelSettings, logger) {
    if (channelSettings.getAuto()) {
        const timeoutID = setTimeout(() => { 
            startHangmanGame(channel, client, channelHangman, logger); 
        }, 1000 * channelSettings.getAutoPlayTimer());
        channelHangman.setTimeoutID(timeoutID);
    }
}

/**
 * Reused function to start a Hangman game.
 * @param {Object} channel Channel to print game start.
 * @param {Object} client Twitch Bot client
 * @param {Object} channelHangman Channel Hangman data
 */
function startHangmanGame(channel, client, channelHangman, logger) {
    // If started when there's a timer to auto start, cancel it.
    if (channelHangman.getTimeoutID() !== null) {
        clearTimeout(channelHangman.getTimeoutID());
        channelHangman.resetTimeoutID();
    }

    // Resets all previous scores and data.
    channelHangman.resetCooldowns();
    channelHangman.resetLives();
    channelHangman.resetGuessed();

    // Picks a new word.
    const selectedWord = getRandomWord();
    logger.debug(`WORD SELECTED: ${selectedWord}`);
    channelHangman.setWord(selectedWord.toUpperCase().split(''));
    channelHangman.setProgress(Array(selectedWord.length).fill('-'));
    channelHangman.setStarted(true);

    client.say(channel, `A Hangman game has started! Play with "!guess <letter/word>". Progress: ${channelHangman.getProgress()}.`);
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
const hangmanStart = ({ channel, client, user, channelHangman, logger }) => {
    if(isAdmin(user)) {
        if(channelHangman.getStarted()) {
            const guessed = channelHangman.getGuessed().length === 0 ? "None" : channelHangman.getGuessed();
            client.say(channel, `@${user["display-name"]} A Hangman game is in progress! Lives: ${channelHangman.getLives()}. Guessed: ${guessed}. Progress: ${channelHangman.getProgress()}. Play with "!guess <letter/word>".`);
        } else {
            startHangmanGame(channel, client, channelHangman, logger);
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
const hangmanGuess = ({ channel, client, user, channelHangman, channelSettings, channelScores, message, logger }) => {
    let guessMessage = message.split(" ");
    if (!channelHangman.getStarted()) {
        // No Hangman game has started.
        if (channelSettings.getError())
            client.say(channel, `@${user["display-name"]} There is currently no Hangman game in progress.`);
    } else if (channelSettings.getSubOnly() && !isSub(user)) {
        // Sub only mode is on and the user is not a sub.
        if (channelSettings.getError())
            client.say(channel, `@${user["display-name"]} Sorry, Hangman games are currently sub-only.`);
    } else if ((guessMessage.length !== 2 || (guessMessage[1].length !== 1 && guessMessage[1].length !== channelHangman.getWordLength())) || !(/^[a-zA-Z]+$/.test(guessMessage[1]))) {
        // Invalid guess.
        if (channelSettings.getError())
            client.say(channel, `@${user["display-name"]} Sorry, that is an invalid guess.`);
    } else if (channelHangman.isInGuessed(guessMessage[1].toUpperCase())) {
        // Already guessed.
        if (channelSettings.getError())
            client.say(channel, `@${user["display-name"]} "${guessMessage[1].toUpperCase()}" has been guessed. Lives: ${channelHangman.getLives()}. Guessed: ${channelHangman.getGuessed()}. Progress: ${channelHangman.getProgress()}.`);
    } else if (guessMessage[1].length === 1){
        // Letter

        // Check cooldown
        const userId = user["user-id"]
        const letterCooldownTime = channelHangman.getLetterCooldown(userId);
        if (letterCooldownTime > 0) {
            if (channelSettings.getError()) {
                const timeRemaining = Math.round((letterCooldownTime - Date.now())/1000);
                client.say(channel, `@${user["display-name"]} You are on letter cooldown for ${timeRemaining} seconds!`);
            }
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
                channelHangman.setStarted(false);
                updateScore(channelScores, true, user["display-name"], user["user-id"]);
                const [win, place] = channelScores.getWinsAndPlaceById(userId);
                const winStreak = channelScores.getCurrentStreak();
                client.say(channel, `@${user["display-name"]} PogChamp CONGRATS! ${winStreak} WIN STREAK! The word is "${channelHangman.getWord()}". You are now in ${ordinalSuffix(place)} place with ${win} wins! PogChamp`);
                startHangmanGameDelay(channel, client, channelHangman, channelSettings, logger);
            } else {
                //Correct, but more letters to be guessed.
                client.say(channel, `@${user["display-name"]} ${times} "${charGuess}". Lives: ${channelHangman.getLives()}. Guessed: ${channelHangman.getGuessed()}. Progress: ${channelHangman.getProgress()}.`);
            }

        } else {
            // Incorrect guess.
            channelHangman.loseALive();
            if(channelHangman.getLives() === 0){
                // Game over
                channelHangman.setStarted(false);
                updateScore(channelScores, false, user["display-name"], user["user-id"]);
                client.say(channel, `@${user["display-name"]} NotLikeThis GAME OVER. No "${charGuess}". Guessed: ${channelHangman.getGuessed()}. Final progress: ${channelHangman.getProgress()}. Actual Word: "${channelHangman.getWord()}". NotLikeThis`);
                startHangmanGameDelay(channel, client, channelHangman, channelSettings, logger);
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
            if (channelSettings.getError()) {
                const timeRemaining = Math.round((wordCooldownTime - Date.now())/1000);
                client.say(channel, `@${user["display-name"]} You are on word cooldown for ${timeRemaining} seconds!`);
            }
            return;
        } else {
            channelHangman.setWordCooldown(userId, Date.now() + (channelSettings.getWordCooldown() * 1000));
        }

        const wordGuess = guessMessage[1].toUpperCase();
        channelHangman.addGuessed(wordGuess);

        if(wordGuess === channelHangman.getWord()) {
            channelHangman.setStarted(false);
            updateScore(channelScores, true, user["display-name"], user["user-id"]);
            const [win, place] = channelScores.getWinsAndPlaceById(userId);
            const winStreak = channelScores.getCurrentStreak();
            client.say(channel, `@${user["display-name"]} PogChamp CONGRATS! ${winStreak} WIN STREAK! The word is "${channelHangman.getWord()}". You are now in ${ordinalSuffix(place)} place with ${win} wins! PogChamp`);
            startHangmanGameDelay(channel, client, channelHangman, channelSettings, logger);
        } else {
            channelHangman.loseALive();
            if(channelHangman.getLives() === 0){
                // Game over
                channelHangman.setStarted(false);
                updateScore(channelScores, false, user["display-name"], user["user-id"]);
                client.say(channel, `@${user["display-name"]} NotLikeThis GAME OVER. The word is not "${wordGuess}". Guessed: ${channelHangman.getGuessed()}. Final progress: ${channelHangman.getProgress()}. Actual Word: "${channelHangman.getWord()}". NotLikeThis`);
                startHangmanGameDelay(channel, client, channelHangman, channelSettings, logger);
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
const hangmanWins = ({ channel, client, user, channelScores }) => {
    const userId = user["user-id"]
    const [win, place] = channelScores.getWinsAndPlaceById(userId);
    if (win === 0) {
        client.say(channel, `@${user["display-name"]} You have 0 wins!`);
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
        client.say(channel, `@${user["display-name"]} There is nobody on the leaderboard.`);
    } else {
        client.say(channel, `@${user["display-name"]} Top Hangman Players: ${topTen}.`);
    }
}

/**
 * Command: !hangman
 * Returns the current Hangman status on this channel.
 */
const hangmanCurrent = ({ channel, client, user, channelHangman }) => {
    if (!channelHangman.getStarted()) {
        client.say(channel, `@${user["display-name"]} There is no Hangman game in progress.`)
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

/** Checks if a message starts with !resetscores */
const isHangmanResetScores = message => (message.startsWith(hangmanCommands.RESETSCORES) && message.split(" ")[0] === hangmanCommands.RESETSCORES);

/**
 * Command: !resetscores
 * Resets the scoreboard of Hangman. Will clear leaderboard, set wins/total to 0. 
 * Has person using command type a long message to confirm it is actually their decision to reset.
 */
const hangmanResetScores = ({ channel, client, user, channelScores, message, logger }) => {
    if(isAdmin(user)) {
        if(message === hangmanCommands.RESETSCORES) {
            client.say(channel, `@${user["display-name"]} To reset scores, please type everthing in between the quotes: "${hangmanCommands.RESETSCORESFULL}"`);
        } else if (message === hangmanCommands.RESETSCORESFULL) {
            logger.debug(`${user["display-name"]} SCOREBOARD BEFORE RESET: ${JSON.stringify(channelScores.getScoresJSON())}`);
            channelScores.resetScores(logger);
            client.say(channel, `@${user["display-name"]} Hangman scores are reset.`);
        }
    }
};

const hangmanStreaks = ({channel, client, user, channelScores }) => {
    const streaks = channelScores.getWinStreaks();
    if (streaks["currentStreak"] === 0 && streaks["bestStreak"] === 0) {
        client.say(channel, `@${user["display-name"]} CURRENT STREAK: None. BEST STREAK: None.`);
    } else if (streaks["currentStreak"] === 0 && streaks["bestStreak"] !== 0) {
        client.say(channel, `@${user["display-name"]} CURRENT STREAK: None. BEST STREAK: ${streaks["bestStreak"]} win(s) by ${streaks["bestUser"]}.`);
    } else {
        client.say(channel, `@${user["display-name"]} CURRENT STREAK: ${streaks["currentStreak"]} win(s) by ${streaks["currentUser"]}. BEST STREAK: ${streaks["bestStreak"]} win(s) by ${streaks["bestUser"]}.`);
    }
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
    hangmanHelp,
    isHangmanResetScores,
    hangmanResetScores,
    hangmanStreaks
};

const { getRandomWord } = require('../data/dictionary');
const { hangmanCommands } = require('../utils/commands');
const { compareLists } = require('../utils/lists');
const { ordinalSuffix, convertPercentage } = require('../utils/numbers');
const { isAdmin, isSub } = require('../utils/users');

/* String list of users who are on cooldown on guessing letters. */
const letterCooldownUser = {};
/* String list of users who are on cooldown on guessing words. */
const wordCooldownUser = {};

/* Boolean for whether a game of Hangman has started. */
let started = false;
/* Hangman guesses remaining. */
let lives = 6;
/* String list of letters/words that have been guessed. */
const guessed = [];

/* Word that Hangman bot randomly selected for the game. */
let word = [];
/* Current progress of Hangman word guess. In char array for faster complexity. */
let progress = [];

/** Time when cooldown ends for wins command. 2 minutes. */
let winsCooldown = 0;
/** Time when cooldown down ends for scoreboard command. 2 minutes. */
let scoreboardCooldown = 0;
/** Time when cooldown down ends for stats command. 2 minutes. */
let statsCooldown = 0;
/** Time when cooldown down ends for help command. 2 minutes. */
let helpCooldown = 0;
/** Time when cooldown down ends for curreng Hangman status command. 2 minutes. */
let currentCooldown = 0;

/**
 * Checks if there is a Hangman game in progress.
 * @returns True if Hangman game is in progress, false if not.
 */
function isHangmanStarted() {
    return started;
}

/**
 * Reused function to start a Hangman game.
 * @param {Object} channel Channel to print game start.
 * @param {Object} client Twitch Bot client
 */
function startHangmanGame(channel, client) {
    // Resets all previous scores and data.
    for(const key in letterCooldownUser) {
        delete letterCooldownUser[key];
    }
    for(const key in wordCooldownUser) {
        delete wordCooldownUser[key];
    }
    lives = 6;
    guessed.length = 0;

    // Picks a new word.
    const selectedWord = getRandomWord();
    console.log(`WORD: ${selectedWord}`);
    word = Array.from(selectedWord.toUpperCase());
    progress = Array(selectedWord.length).fill('-');

    client.say(channel, `A Hangman game has started! Use "!guess <letter or word here>" to play. Progress: ${progress.join('')}.`);
    started = true;
}

/**
 * Check to see if the game auto starts.
 * @param {Object} channel Channel to print game start.
 * @param {Object} client Twitch Bot client
 * @param {Object} channelSettings Class to call possible channel settings.
 */
function autoStartHangman(channel, client, channelSettings) {
    if (channelSettings.getAuto()) {
        startHangmanGame(channel, client);
    } else {
        started = false;
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
const hangmanStart = ({ channel, client, user }) => {
    if(!started && isAdmin(user)){
        startHangmanGame(channel, client);
    }
};

/*
 * Command: !end
 * Permissions: Broadcaster and mods only.
 * Manually ends a game.
 */
const hangmanEnd = ({ channel, client, user }) => {
    if(started && isAdmin(user)){
        started = false;
        client.say(channel, `The Hangman game has ended.`);
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
const hangmanGuess = ({ channel, client, user, channelSettings, channelScores, message }) => {
    if (!started || (channelSettings.getSubOnly() && !isSub(user))) return;

    let guessMessage = message.split(" ");
    if ((guessMessage.length !== 2 || (guessMessage[1].length !== 1 && guessMessage[1].length !== word.length)) || !(/^[a-zA-Z]+$/.test(guessMessage[1]))) {
        // Invalid guess.
        client.say(channel, `@${user["display-name"]} Invalid "!guess <letter/word>".`);
    } else if (guessed.includes(guessMessage[1].toUpperCase())) {
        // Already guessed.
        client.say(channel, `@${user["display-name"]} "${guessMessage[1].toUpperCase()}" has been guessed. Lives: ${lives}. Guessed: ${guessed.join(', ')}. Progress: ${progress.join('')}.`);
    } else if (guessMessage[1].length === 1){
        // Letter

        // Check cooldown
        const userId = user["user-id"]
        if ((userId in letterCooldownUser) && (letterCooldownUser[userId] > Date.now())) {
            return;
        } else {
            letterCooldownUser[userId] = Date.now() + (channelSettings.getLetterCooldown() * 1000);
        }

        // Add letter to list of guesses
        const charGuess = guessMessage[1].toUpperCase();
        guessed.push(charGuess);
        guessed.sort();

        // Check if the letter was a correct guess.
        let times = 0;
        for (let i = 0; i < word.length; i++) {
            if(word[i] === charGuess) {
                progress[i] = charGuess;
                times++;
            }
        }

        if(times > 0) {
            // Correct guess.
            if(compareLists(word, progress)) {
                // Winner, so upload stats and announce win.
                updateScore(channelScores, true, user["display-name"], user["user-id"]);
                const [win, place] = channelScores.getWinsAndPlaceById(userId);
                client.say(channel, `@${user["display-name"]} You win! Word is "${word.join('')}". You are now in ${ordinalSuffix(place)} place with ${win} wins!`);
                autoStartHangman(channel, client, channelSettings);
            } else {
                //Correct, but more letters to be guessed.
                client.say(channel, `@${user["display-name"]} ${times} "${charGuess}". Lives: ${lives}. Guessed: ${guessed.join(', ')}. Progress: ${progress.join('')}.`);
            }

        } else {
            // Incorrect guess.
            lives--;
            if(lives === 0){
                // Game over
                updateScore(channelScores, false, user["display-name"], user["user-id"]);
                client.say(channel, `@${user["display-name"]} GAME OVER. No "${charGuess}". Guessed: ${guessed.join(', ')}. Final progress: ${progress.join('')}. Actual Word: "${word.join('')}".`);
                autoStartHangman(channel, client, channelSettings);
            } else {
                // Incorrect, but there are still lives remaining.
                client.say(channel, `@${user["display-name"]} No "${charGuess}". Lives: ${lives}. Guessed: ${guessed.join(', ')}. Progress: ${progress.join('')}.`);
            }
        }
    } else if (guessMessage[1].length === word.length) {
        // Word guess

        // Check cooldown
        const userId = user["user-id"]
        if ((userId in wordCooldownUser) && (wordCooldownUser[userId] > Date.now())) {
            return;
        } else {
            wordCooldownUser[userId] = Date.now() + (channelSettings.getWordCooldown() * 1000);
        }

        const wordGuess = guessMessage[1].toUpperCase();
        guessed.push(wordGuess);
        guessed.sort();

        if(wordGuess === word.join('')) {
            updateScore(channelScores, true, user["display-name"], user["user-id"]);
            const [win, place] = channelScores.getWinsAndPlaceById(userId);
            client.say(channel, `@${user["display-name"]} You win! Word is "${word.join('')}". You are now in ${ordinalSuffix(place)} place with ${win} wins!`);
            autoStartHangman(channel, client, channelSettings);
        } else {
            lives--;
            if(lives === 0){
                // Game over
                updateScore(channelScores, false, user["display-name"], user["user-id"]);
                client.say(channel, `@${user["display-name"]} GAME OVER. The word is not "${wordGuess}". Guessed: ${guessed.join(', ')}. Final progress: ${progress.join('')}. Actual Word: "${word.join('')}".`);
                autoStartHangman(channel, client, channelSettings);
            } else {
                // Incorrect, but there are still lives remaining.
                client.say(channel, `@${user["display-name"]} The word is not "${wordGuess}". Lives: ${lives}. Guessed: ${guessed.join(', ')}. Progress: ${progress.join('')}.`);
            }
        }
    } else {
        // Should never be here, so error message.
        client.say(channel, `@${user["display-name"]} Invalid "!guess <letter/word>".`);
    }
};

/**
 * Command: !wins
 * Returns the number of wins a user has and their place on their keyboard.
 * 2 minute cooldown to prevent spam.
 */
const hangmanWins = ({ channel, client, user, id, channelScores }) => {
    if (winsCooldown > Date.now()) {
        return;
    } 
    winsCooldown = Date.now() + (1000 * 120);

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
 * 2 minute cooldown to prevent spam.
 */
const hangmanStats = ({channel, client, user, channelScores }) => {
    if (statsCooldown > Date.now()) {
        return;
    }
    statsCooldown = Date.now() + (1000 * 120);

    const [win, total] = channelScores.getChannelWins();
    client.say(channel, `@${user["display-name"]} There is a ${convertPercentage(win, total)} win rate, with with ${win} wins and ${total} total games played.`);
}

/**
 * Command: !leaderboard
 * Returns the top 10 players of Hangman on a channel.
 * 2 minute cooldown to prevent spam.
 */
const hangmanLeaderboard = ({channel, client, user, channelScores }) => {
    if (scoreboardCooldown > Date.now()) {
        return;
    }
    scoreboardCooldown = Date.now() + (1000 * 120);
    
    const topTen = channelScores.getTopTen();
    if (topTen.length === 0) {
        client.say(channel, `@${user["display-name"]} There is currently nobody on the leaderboard.`);
    } else {
        client.say(channel, `@${user["display-name"]} TOP ${topTen.length} HANGMAN PLAYERS: ${topTen}.`);
    }
}

/**
 * Command: !hangman
 * Returns the current Hangman status on this channel.
 * 2 minute cooldown to prevent spam.
 */
const hangmanCurrent = ({ channel, client, user }) => {
    if (currentCooldown > Date.now()) {
        return;
    }
    currentCooldown = Date.now() + (1000 * 20);

    if (!started) {
        client.say(channel, `@${user["display-name"]} There is currently no Hangman game in progress.`)
    } else {
        client.say(channel, `@${user["display-name"]} Lives: ${lives}. Guessed: ${guessed.join(', ')}. Progress: ${progress.join('')}. Use "!guess <letter or word here>" to play.`)
    }
}

/**
 * Command: !help
 * Tells the user where they can read more about this Hangman Bot.
 * 2 minute cooldown to prevent spam.
 */
const hangmanHelp = ({ channel, client, user }) => {
    if (helpCooldown > Date.now()) {
        return;
    }
    helpCooldown = Date.now() + (1000 * 120);

    client.say(channel, `@${user["display-name"]} https://github.com/ys8672/HangmanBot`);
}

module.exports = {
    isHangmanStarted,
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

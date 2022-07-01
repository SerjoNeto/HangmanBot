const { getRandomWord } = require('../data/dictionary');
const { hangmanCommands } = require('../utils/commands');
const { compareLists } = require('../utils/lists');
// HANGMAN VARIABLES

/* String list of users who are on cooldown on guessing letters. */
const letterCooldownUser = {};
/* String list of users who are on cooldown on guessing words. */
const wordCooldownUser = {};
/* Letter cooldown in milliseconds.*/
let letterCooldown = 30000;
/* Word cooldown in milliseconds.*/
let wordCooldown = 90000;

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

/*
 * Command: !start
 * Permissions: Broadcaster and mods only.
 * Manually starts a new Hangman game for chat to play.
 */
const hangmanStart = ({ channel, client, user }) => {
    //if(isBroadcasterOrMod(user)){
        if(started){
            // If a Hangman game is in progress, nothing happens.
            client.say(channel, `A Hangman game is in progress!`);
        } else {
            // Resets all previous scores and data.
            for(const key in letterCooldown) {
                delete letterCooldown[key];
            }
            for(const key in wordCooldown) {
                delete wordCooldown[key];
            }
            lives = 6;
            guessed.length = 0;

            // Picks a new word.
            const selectedWord = getRandomWord();
            console.log(`Word selected: ${selectedWord}`);
            word = Array.from(selectedWord.toUpperCase());
            progress = Array(selectedWord.length).fill('-');

            console.log(`${word.join('')}`);
            client.say(channel, `A Hangman game has started! Use "!guess <letter or word here>" to play. Progress: ${progress.join('')}.`);
            started = true;
        }
    //}
};

/*
 * Command: !end
 * Permissions: Broadcaster and mods only.
 * Manually ends a game.
 */
const hangmanEnd = ({ channel, client, user }) => {
    if(started){
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
const hangmanGuess = ({ channel, client, user, message }) => {
    let guessMessage = message.split(" ");

    if (!started) {
        // Game not started.
        client.say(channel, `@${user["display-name"]} There is no Hangman game in progress.`);
    } else if (guessMessage.length !== 2 || (guessMessage[1].length !== 1 && guessMessage[1].length !== word.length)) {
        // Invalid guess.
        client.say(channel, `@${user["display-name"]} Invalid "!guess <letter/word>".`);
    } else if (guessed.includes(guessMessage[1].toUpperCase())) {
        // Already guessed.
        client.say(channel, `@${user["display-name"]} "${guessMessage[1].toUpperCase()}" has been guessed. Guessed: ${guessed.join(', ')}.`);
    } else if (guessMessage[1].length === 1){
        // Letter

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
                started = false;
                client.say(channel, `@${user["display-name"]} You win! Word is "${word.join('')}".`);
            } else {
                //Correct, but more letters to be guessed.
                client.say(channel, `@${user["display-name"]} ${times} "${charGuess}". Lives: ${lives}. Guessed: ${guessed.join(', ')}. Progress: ${progress.join('')}.`);
            }

        } else {
            // Incorrect guess.
            lives--;
            if(lives === 0){
                // Game over
                started = false;
                client.say(channel, `@${user["display-name"]} GAME OVER. No "${charGuess}". Guessed: ${guessed.join(', ')}. Final progress: ${progress.join('')}. Actual Word: "${word.join('')}".`);
            } else {
                // Incorrect, but there are still lives remaining.
                client.say(channel, `@${user["display-name"]} No "${charGuess}". Lives: ${lives}. Guessed: ${guessed.join(', ')}. Progress: ${progress.join('')}.`);
            }
        }
    } else if (guessMessage[1].length === word.length) {
        // Word guess
        const wordGuess = guessMessage[1].toUpperCase();
        guessed.push(wordGuess);
        guessed.sort();

        if(wordGuess === word.join('')) {
            started = false;
            client.say(channel, `@${user["display-name"]} You win! Word is "${word.join('')}".`);
        } else {
            lives--;
            if(lives === 0){
                // Game over
                started = false;
                client.say(channel, `@${user["display-name"]} GAME OVER. The word is not "${wordGuess}". Guessed: ${guessed.join(', ')}. Final progress: ${progress.join('')}. Actual Word: "${word.join('')}".`);
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

module.exports = {
    isGuess,
	hangmanStart,
	hangmanEnd,
    hangmanGuess
};

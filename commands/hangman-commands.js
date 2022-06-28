const { getRandomWord} = require('../data/dictionary');
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
            word = Array.from(selectedWord);
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

module.exports = {
	hangmanStart,
	hangmanEnd
};

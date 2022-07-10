class ChannelHangman {

    /* String list of users who are on cooldown on guessing letters. */
    #letterCooldownUser;
    /* String list of users who are on cooldown on guessing words. */
    #wordCooldownUser;
    /* Boolean for whether a game of Hangman has started. */
    #started;
    /* Hangman guesses remaining. */
    #lives;
    /* String list of letters/words that have been guessed. */
    #guessed;
    /* Word that Hangman bot randomly selected for the game. */
    #word;
    /* Current progress of Hangman word guess. In char array for faster complexity. */
    #progress;

    /**
     * Constructor for creating a new ChannelHangman class
     */
    constructor() {
        this.#letterCooldownUser = {};
        this.#wordCooldownUser = {};
        this.#started = false;
        this.#lives = 6;
        this.#guessed = [];
        this.#word = [];
        this.#progress = [];
    }

    /**
     * Check what time the user is off letter cooldown
     * @param {String} userId ID of user on cooldown.
     * @returns Time when cooldown ends, 0 of not on list or cooldown has already ended.
     */
    getLetterCooldown(userId) {
        if ((userId in this.#letterCooldownUser) && (this.#letterCooldownUser[userId] > Date.now())){
            return this.#letterCooldownUser[userId];
        } else {
            return 0;
        }
    }

    /**
     * Set the letter cooldown for a user
     * @param {String} userId ID for user
     * @param {Date} time Time when cooldown is finished.
     */
    setLetterCooldown(userId, time) {
        this.#letterCooldownUser[userId] = time;
    }

        /**
     * Checks userId word cooldown
     * @param {String} userId ID of user on cooldown.
     * @returns Time when cooldown ends, 0 of not on list or cooldown has already ended.
     */
    getWordCooldown(userId) {
        if ((userId in this.#wordCooldownUser) && (this.#wordCooldownUser[userId] > Date.now())){
            return this.#wordCooldownUser[userId];
        } else {
            return 0;
        }
    }

    /**
     * Set the word cooldown for a user
     * @param {String} userId ID for user
     * @param {Date} time Time when cooldown is finished.
     */
    setWordCooldown(userId, time) {
        this.#wordCooldownUser[userId] = time;
    }

    /**
     * Clear both letter and word cooldowns objects.
     */
    resetCooldowns() {
        for(const key in this.#letterCooldownUser) {
            delete this.#letterCooldownUser[key];
        }
        for(const key in this.#wordCooldownUser) {
            delete this.#wordCooldownUser[key];
        }
    }

    /**
     * Tells user if a game has started.
     * @returns {Boolean} If there is a Hangman guess in progress
     */
    getStarted() {
        return this.#started;
    }

    /**
     * Sets started to certain boolean
     * @param started {Boolean} State to set to started.
     */
    setStarted(started) {
        this.#started = started;
    }


    /**
     * Gets number of lives.
     * @returns Number of lives remaining.
     */
    getLives() {
        return this.#lives;
    }

    /**
     * Subtract one from the number of lives.
     */
    loseALive() {
        this.#lives--;
    }

    /**
     * Reset lives back to 6.
     */
    resetLives() {
        this.#lives = 6;
    }


    /**
     * Gets the current list of guessed letters / words
     * @returns {List} Guessed letters/words.
     */
    getGuessed() {
        return this.#guessed.join(", ");
    }

    /**
     * Checks if a certain guess has already been guessed.
     * @param {String} str String to check if it has already been guessed. 
     * @returns {Boolean} True if has been guessed, false if not been guessed.
     */
    isInGuessed(str) {
        return this.#guessed.includes(str);
    }

    /**
     * Add letter/word to guessed list and sort the list.
     * @param {String} str String to add to guessed list.
     */
    addGuessed(str) {
        this.#guessed.push(str);
        this.#guessed.sort();
    }

    /**
     * Reset the guessed list to empty.
     */
    resetGuessed() {
        this.#guessed.length = 0;
    }


    /**
     * Gets current word in string form
     * @returns Get the current word.
     */
    getWord() {
        return this.#word.join('');
    }

    /**
     * Sets current word.
     * @param {List} word String to set word as
     */
    setWord(word){
        this.#word = word;
    }

    /**
     * Gets the current word length.
     * @returns {integer} Word length
     */
    getWordLength() {
        return this.#word.length;
    }

    /**
     * Gets current progress in string form
     * @returns Gets the current progress.
     */
    getProgress() {
        return this.#progress.join('');
    }

    /**
     * Sets the current progress.
     * @param {List} progress String to set progress as
     */
    setProgress(progress) {
        this.#progress = progress;
    }

    /**
     * Check the number of correct guesses for a letter.
     * @param {String} charGuess Guessed character
     * @returns How many correct guesses there were
     */
    checkLetterGuess(charGuess) {
        let times = 0;
        for (let i = 0; i < this.#word.length; i++) {
            if(this.#word[i] === charGuess) {
                this.#progress[i] = charGuess;
                times++;
            }
        }
        return times;
    }

}

module.exports = {
    ChannelHangman
}
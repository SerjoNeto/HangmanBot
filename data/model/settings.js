const fs = require('fs');

/**
 * Class created for every Hangman channel for settings that can be set.
 */
class ChannelSettings {

    /**
     * Settings admins can change for Hangman on a channel
     * @param {integer} letterCooldown Time before user is allowed another letter guess.
     * @param {integer} wordCooldown Time before user is allowed another word guess.
     * @param {boolean} subOnly Only allow subscribers to play.
     * @param {boolean} autoPlay Automatically start another Hangman game when one ends.
     */
    constructor(
        letterCooldown = 30,
        wordCooldown = 90,
        subOnly = false,
        autoPlay = false
    ) {
        this.letterCooldown = letterCooldown
        this.wordCooldown = wordCooldown
        this.subOnly = subOnly,
        this.autoPlay = autoPlay
    }

    /**
     * Get JSON version of the channel settings.
     * @returns Channel settings in JSON object format.
     */
    getSettingJSON() {
        const settingInJSON = {
            letterCooldown: this.letterCooldown,
            wordCooldown: this.wordCooldown,
            subOnly: this.subOnly,
            autoPlay: this.autoPlay
        }
        return settingInJSON;
    }

    /**
     * Set variables based on the JSON.
     * @param {Object} settingJSON Setting JSON object to change the variables.
     */
    setSettingJSON(settingJSON) {
        this.letterCooldown = settingJSON.letterCooldown;
        this.wordCooldown = settingJSON.wordCooldown;
        this.subOnly = settingJSON.subOnly;
        this.autoPlay = settingJSON.autoPlay;
    }

    /**
     * Load previously saved settings.
     * @param {String} id String integer with the unique ID of the Twitch channel
     */
    loadSettings(id) {
        const file = `./logs/${id}/settings.json`
        if (!fs.existsSync(file)){
            fs.writeFile(file, JSON.stringify(this.getSettingJSON(), null, 4), (err) => {});
        } else {
            try {
                const settingsJson = fs.readFileSync(file, 'utf-8');
                this.setSettingJSON(JSON.parse(settingsJson));
            } catch {
                fs.writeFile(file, JSON.stringify(this.getSettingJSON(), null, 4), (err) => {});
            }
        }
    }

    /**
     * Save the current settings into a JSON file.
     * @param {String} id String integer with the unique ID of the Twitch channel
     */
    saveSettings(id) {
        const file = `./logs/${id}/settings.json`
        fs.writeFile(file, JSON.stringify(this.getSettingJSON(), null, 4), (err) => {});
    }
    
    /**
     * Returns current letter cooldown.
     */
    getLetterCooldown() {
        return this.letterCooldown;
    }

    /**
     * Sets a new letter cooldown. Only allowed betwee 0-999 seconds.
     * @param {int} second Time in seconds of new letter cooldown
     * @param {int} id ID of the Twitch channel.
     * @returns If new letter cooldown was successfully set
     */
    setLetterCooldown(second, id) {
        if (second < 0 || second > 999) {
            return false;
        } else {
            this.letterCooldown = second;
            this.saveSettings(id);
            return true;
        }
    }

    /**
     * Returns current word cooldown.
     */
    getWordCooldown() {
        return this.wordCooldown;
    }

    /**
     * Sets a new word cooldown. Only allowed betwee 0-999 seconds.
     * @param {int} second Time in seconds of new word cooldown
     * @param {int} id ID of the Twitch channel.
     * @returns If new word cooldown was successfully set
     */
    setWordCooldown(second, id) {
        if (second < 0 || second > 999) {
            return false;
        } else {
            this.wordCooldown = second;
            this.saveSettings(id);
            return true;
        }
    }

    /**
     * Returns current subOnly state.
     * @returns IF Hangman is for subscribers only
     */
    getSubOnly() {
        return this.subOnly;
    }

    /**
     * Sets whether only subscribers can play Hangman.
     * @param {boolean} state New state to set for subOnly
     * @param {int} id ID for the current Hangman player.
     * @returns True if new sub only state is set, false if the same.
     */
    setSubOnly(state, id) {
        if (this.subOnly === state) {
            return false;
        } else {
            this.subOnly = state;
            this.saveSettings(id);
            return true;
        }
    }

        /**
     * Returns current subOnly state.
     * @returns IF Hangman is for subscribers only
     */
    getSubOnly() {
        return this.subOnly;
    }

    /**
     * Sets whether only subscribers can play Hangman.
     * @param {boolean} state New state to set for subOnly
     * @param {int} id ID for the current Hangman player.
     * @returns True if new sub only state is set, false if the same.
     */
    setSubOnly(state, id) {
        if (this.subOnly === state) {
            return false;
        } else {
            this.subOnly = state;
            this.saveSettings(id);
            return true;
        }
    }

    /**
     * Returns current auto play Hangman state.
     * @returns If a game starts immediately after one has ended.
     */
    getSubOnly() {
        return this.autoPlay;
    }

    /**
     * Sets whether a new Hangman games start automatically after the previous one ended. 
     * @param {boolean} state New state to set for autoPlay.
     * @param {int} id ID for the current Hangman player.
     * @returns True if new sub only state is set, false if the same.
     */
    setSubOnly(state, id) {
        if (this.autoPlay === state) {
            return false;
        } else {
            this.autoPlay = state;
            this.saveSettings(id);
            return true;
        }
    }
    
    /**
     * Prints the settings in a readable format
     * @returns String for what the current settings are. 
     */
    printSettings() {
        return `Letter Guess Cooldown: ${this.letterCooldown}. Word Guess Cooldown: ${this.wordCooldown}. Sub Only: ${this.subOnly}. Auto Start:${this.autoPlay}.`;
    }
}

module.exports = {
    ChannelSettings
}
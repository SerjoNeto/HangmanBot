const fs = require('fs');

/**
 * Class created for every Hangman channel for settings that can be set.
 */
class ChannelSettings {
    
    #id;
    #letterCooldown;
    #wordCooldown;
    #subOnly;
    #autoPlay;

    /**
     * Settings admins can change for Hangman on a channel
     * @param {String} id ID of the user class with the setting.
     * @param {integer} letterCooldown Time before user is allowed another letter guess.
     * @param {integer} wordCooldown Time before user is allowed another word guess.
     * @param {boolean} subOnly Only allow subscribers to play.
     * @param {boolean} autoPlay Automatically start another Hangman game when one ends.
     */
    constructor(userId) {
        this.#id = userId
        this.#letterCooldown = 30
        this.#wordCooldown = 60
        this.#subOnly = false
        this.#autoPlay = false
    }

    /**
     * Get JSON version of the channel settings.
     * @returns Channel settings in JSON object format.
     */
    getSettingJSON() {
        const settingInJSON = {
            id: this.#id,
            letterCooldown: this.#letterCooldown,
            wordCooldown: this.#wordCooldown,
            subOnly: this.#subOnly,
            autoPlay: this.#autoPlay
        }
        return settingInJSON;
    }

    /**
     * Set variables based on the JSON.
     * @param {Object} settingJSON Setting JSON object to change the variables.
     */
    setSettingJSON(settingJSON) {
        this.#id = settingJSON.id;
        this.#letterCooldown = settingJSON.letterCooldown;
        this.#wordCooldown = settingJSON.wordCooldown;
        this.#subOnly = settingJSON.subOnly;
        this.#autoPlay = settingJSON.autoPlay;
    }

    /**
     * Load previously saved settings.
     */
    loadSettings() {
        const file = `./logs/${this.#id}/settings.json`
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
     */
    saveSettings() {
        const file = `./logs/${this.#id}/settings.json`
        fs.writeFile(file, JSON.stringify(this.getSettingJSON(), null, 4), (err) => {});
    }
    
    /**
     * Returns current letter cooldown.
     */
    getLetterCooldown() {
        return this.#letterCooldown;
    }

    /**
     * Sets a new letter cooldown. Only allowed betwee 0-3600 seconds.
     * @param {int} second Time in seconds of new letter cooldown
     * @returns If new letter cooldown was successfully set
     */
    setLetterCooldown(second) {
        if (second < 0 || second > 3600 || this.#letterCooldown === second) {
            return false;
        } else {
            this.#letterCooldown = second;
            this.saveSettings();
            return true;
        }
    }

    /**
     * Returns current word cooldown.
     */
    getWordCooldown() {
        return this.#wordCooldown;
    }

    /**
     * Sets a new word cooldown. Only allowed betwee 0-3600 seconds.
     * @param {int} second Time in seconds of new word cooldown
     * @returns If new word cooldown was successfully set
     */
    setWordCooldown(second) {
        if (second < 0 || second > 3600 || this.#wordCooldown === second) {
            return false;
        } else {
            this.#wordCooldown = second;
            this.saveSettings();
            return true;
        }
    }

    /**
     * Returns current subOnly state.
     * @returns IF Hangman is for subscribers only
     */
    getSubOnly() {
        return this.#subOnly;
    }

    /**
     * Sets whether only subscribers can play Hangman.
     * @param {boolean} state New state to set for subOnly
     * @returns True if new sub only state is set, false if the same.
     */
    setSubOnly(state) {
        if (this.#subOnly === state) {
            return false;
        } else {
            this.#subOnly = state;
            this.saveSettings();
            return true;
        }
    }

    /**
     * Returns current auto play Hangman state.
     * @returns If a game starts immediately after one has ended.
     */
    getAuto() {
        return this.#autoPlay;
    }

    /**
     * Sets whether a new Hangman games start automatically after the previous one ended. 
     * @param {boolean} state New state to set for autoPlay.
     * @returns True if new sub only state is set, false if the same.
     */
    setAuto(state) {
        if (this.#autoPlay === state) {
            return false;
        } else {
            this.#autoPlay = state;
            this.saveSettings();
            return true;
        }
    }
    
    /**
     * Prints the settings in a readable format
     * @returns String for what the current settings are. 
     */
    printSettings() {
        const subOnlyState = this.#subOnly ? "ON" : "OFF";
        const autoPlayState = this.#autoPlay ? "ON" : "OFF"
        return `Letter Guess Cooldown: ${this.#letterCooldown} SECOND(S). Word Guess Cooldown: ${this.#wordCooldown} SECOND(S). Sub Only: ${subOnlyState}. Auto Start: ${autoPlayState}.`;
    }
}

module.exports = {
    ChannelSettings
}
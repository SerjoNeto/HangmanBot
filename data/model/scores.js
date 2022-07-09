const fs = require('fs');

/**
 * Class to keep track of Hangman scores on a channel.
 */
class ChannelScores {

    #id
    #wins;
    #total;
    #scoreboard;

    /**
     * Constructor for a ChannelScores class.
     * @param {integer} wins Number of successful Hangman guesses.
     * @param {integer} total Number of total Hangman games played.
     * @param {list} scoreboard Scores of everybody playing.
     */
    constructor(userID) {
        this.#id = userID
        this.#wins = 0
        this.#total = 0
        this.#scoreboard = []
    }

    /**
     * Gets all data as a JSON object
     * @returns scores in JSON object format
     */
    getScoresJSON() {
        const scoreInJSON = {
            id: this.#id,
            wins: this.#wins,
            total: this.#total,
            scoreboard: this.#scoreboard
        }
        return scoreInJSON;
    }

    /**
     * Sets the current variables to a parsed scores object from a JSON file.
     * @param {Object} scoresJSON Saved and parsed scores JSON to set
     */
    setScoresJSON(scoresJSON) {
        this.#id = scoresJSON.id
        this.#wins = scoresJSON.wins
        this.#total = scoresJSON.total
        this.#scoreboard = scoresJSON.scoreboard
    }

    /**
     * Loads current scores if it exists, else use default and create the scores file.
     */
    loadScores() {
        const file = `./logs/${this.#id}/scores.json`
        if (!fs.existsSync(file)){
            fs.writeFile(file, JSON.stringify(this.getScoresJSON(), null, 4), (err) => {});
        } else {
            try {
                const scoresJSON = fs.readFileSync(file, 'utf-8');
                this.setScoresJSON(JSON.parse(scoresJSON));
            } catch {
                fs.writeFile(file, JSON.stringify(this.getScoresJSON(), null, 4), (err) => {});
            }
        }
    }

    /**
     * Saves the current scores
     */
    saveScores() {
        const file = `./logs/${this.#id}/scores.json`
        fs.writeFile(file, JSON.stringify(this.getScoresJSON(), null, 4), (err) => {});
    }

    /**
     * Add one win to the user in the scoreboard list, and sorts the list.
     * @param {String} user Username of winner
     * @param {String} id ID of winner
     */
    addToScoreBoard(user, id) {
        const filteredList = (this.#scoreboard).filter(e => e.id === id);
        if (filteredList.length > 0) {
            // ID already exists.
            const userScoreBoard = filteredList[0];
            // Update Twitch name if changed.
            if (userScoreBoard.user !== user) {
                userScoreBoard.user = user;
            }
            userScoreBoard.wins++;
        } else {
            // Id does not exist, so create new object for it. 
            const newScoreObject = {};
            newScoreObject["id"] = id;
            newScoreObject["user"] = user;
            newScoreObject["wins"] = 1;
            (this.#scoreboard).push(newScoreObject);
        }
        (this.#scoreboard).sort((a, b) => b.wins - a.wins);
    }

    /**
     * Get number of wins.
     * @returns Number of wins.
     */
    getWins() {
        return this.#wins;
    }

    /**
     * Add one to the number of wins.
     */
    addWin(name, id) {
        this.#wins++;
        this.#total++;
        this.addToScoreBoard(name, id);
        this.saveScores();
    }

    /**
     * Get number of total games.
     * @returns Number of games.
     */
    getTotal() {
        return this.#total;
    }

    /**
     * Add one to the number of total games played.
     */
    addTotal() {
        this.#total++;
        this.saveScores();
    }

    /**
     * Returns the number of Hangman wins a user has and their position in the scoreboard.
     * @param {String} userID String of user ID
     * @returns List in order of [wins, place]
     */
    getWinsAndPlaceById(userID) {
        (this.#scoreboard).sort((a, b) => b.wins - a.wins);
        const filteredList = (this.#scoreboard).filter(e => e.id === userID);
        if (filteredList.length > 0) {
            const userWins = (filteredList[0]).wins;
            const place = (this.#scoreboard).findIndex(e => e.wins === userWins);
            return [userWins, place + 1];
        } else {
            return [0, -1];
        }
    }

    /**
     * Get the top 10 Hangman players on a channel.
     * @returns String of top 10 Hangman winners
     */
    getTopTen() {
        (this.#scoreboard).sort((a, b) => b.wins - a.wins);
        const shortList = (this.#scoreboard).slice(0, 10).map(e => `${e.user}: ${e.wins} wins`);
        return shortList.join(", ");
    }

    /**
     * Returns overall stats about Hangman on a channel.
     * @returns Wins, Total games of a channel
     */
    getChannelWins() {
        return [(this.#wins), (this.#total)];
    }
}

module.exports = {
    ChannelScores
}
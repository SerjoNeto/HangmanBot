const fs = require('fs');

let dictionary = [];
const dictionaryLocation = "./private/dict.txt";

/**
 * Loads the dictionary from dictionaryLocation and puts it into a dictionary list.
 * Has a 9 4-letter list in case the file doesn't exist.
 */
function loadDictionary() {
	try {
	    dictionary = fs.readFileSync(dictionaryLocation).toString().split("\n");
	} catch {
		dictionary = ['ally', 'beta', 'cool', 'deal', 'else', 'flew', 'good', 'hope', 'ibex'];
	}
}

/**
 * Get a random word from the dictionary.
 * @returns {String} Word from the dictionary list.
 */
function getRandomWord() {
	if(dictionary === undefined || dictionary.length === 0) {
		loadDictionary();
	}
    return dictionary[Math.floor(Math.random() * dictionary.length)].trim().toUpperCase();
}

module.exports = {
	loadDictionary,
	getRandomWord
}
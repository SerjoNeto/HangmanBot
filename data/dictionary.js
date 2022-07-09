const fs = require('fs');

let dictionary = [];
const dictionaryLocation = "./private/real-dict.txt";

function loadDictionary() {
	try {
	    dictionary = fs.readFileSync(dictionaryLocation).toString().split("\n");
	} catch {
		dictionary = ['ally', 'beta', 'cool', 'deal', 'else', 'flew', 'good', 'hope', 'ibex'];
	}
}

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
const fs = require('fs');

let dictionary = [];
const dictionaryLocation = "./data/real-dict.txt";

function loadDictionary() {
	try {
	    dictionary = fs.readFileSync(dictionaryLocation).toString().split("\n");
	} catch {
		dictionary = ['error'];
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
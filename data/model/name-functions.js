const fs = require('fs');

const dataPath = './data/name-data.json';

let nameId = {};

// Checks if [id] exists in the nameId list.
const hasId = (id) => (id in nameId);

// Returns the name string for a [id], null if does not exist.
const getName = (id) => {
	if (hasId(id)) {
		return nameId[id];
	} else {
		return null;
	}
}

// Adds or replaces the name to the nameId.
function addName(id, name) {
	if (!hasId(id)) {
		nameId[id] = name;
		saveNameIdData();
	}
}

// Replaces name based on an id.
function transferName(id, name) {
	if (hasId(id)) {
		nameId[id] = name;
		saveNameIdData();
	}
}

// Deletes the name from the nameId.
function deleteName(id) {
	if (hasId(id)) {
		delete nameId[id];
		saveNameIdData();
	}
}

// Loads the Name ID data from the JSON file. Returns true if successful.
function loadNameIdData(client, channel) {
    try {
    	var userIdJSON = fs.readFileSync(dataPath, 'utf-8');
        nameId = JSON.parse(userIdJSON);
        return nameId;
    } catch (e) {
        return null;
    }
}

// Saves the Name ID data to the JSON file.
function saveNameIdData() {  
	fs.writeFile(dataPath, JSON.stringify(nameId, null, 4), (err) => {});
}

module.exports = {
	hasId,
	getName,
	addName,
	deleteName,
	loadNameIdData,
	transferName
}
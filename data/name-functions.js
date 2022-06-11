const fs = require('fs');
const dataPath = './data/name-data.json';

let nameId = {};

const hasId = (id) => (id in nameId);

const getName = (id) => {
	if (hasId(id)) {
		return nameId[id];
	} else {
		return null;
	}
}

function addName(id, name) {
	nameId[id] = name;
	saveNameIdData();
}

function deleteName(id) {
	delete nameId[id];
	saveNameIdData();
}

function loadNameIdData() {
	
}

function saveNameIdData() {  
	fs.writeFile(dataPath, JSON.stringify(nameId), (err) => {});
}

module.exports = {
	hasId,
	getName,
	addName,
	deleteName
}
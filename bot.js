const tmi = require('tmi.js');

const { hangmanBotOAuth } = require('./private/password');
const { mainCommands } = require('./utils/commands');
const { 
    addHangmanClient, 
    removeHangmanClient,
    transferHangmanClient,
    autoStartHangmanClient,
} = require('./commands/main-commands');
const { loadNameIdData } = require('./data/name-functions');
const { loadDictionary } = require('./data/dictionary');

const nameDataLocation = './data/name-data.json';
const hangmanChannel = 'PlayHangmanBot';
const options = {
    options: {
        debug: true,
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: hangmanChannel,
        password: hangmanBotOAuth,
    },
    channels: [hangmanChannel],
};

const client = new tmi.client(options);
client.connect();

client.on('connected', (address, port) => {
    loadDictionary();
    const nameList = loadNameIdData(client, hangmanChannel)
    if (nameList !== null) {
        autoStartHangmanClient(client, hangmanChannel, nameList);
        client.action(hangmanChannel, `is live! Previously saved data loaded successfully!`);
    } else {
        client.action(hangmanChannel, `is live! Previously saved data failed to load.`);  
    }
});

client.on('message', (channel, user, message, self) => {
	// Ignore self messages and non-commands.
    if(self || !message.startsWith("!")) return;

    // Username + unique ID of command user.
    const name = user["display-name"];
    const id = user["user-id"];
    const props = { client, channel, name, id };

    /* Dictionary list of explicit commands */
    const chatCommands = {
        [mainCommands.ADD]: () => addHangmanClient(props),
        [mainCommands.REMOVE]: () => removeHangmanClient(props),
        [mainCommands.TRANSFER]: () => transferHangmanClient(props)
    }

    let command;
    switch(true){
        default:
            command = message;
            break;
    }

    /* Node versions < v14 do not support optional chaining (null safe operator) */
    if(chatCommands[command]) {
        chatCommands[command]();
    }
});

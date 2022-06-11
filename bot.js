const tmi = require('tmi.js');
const { hangmanBotOAuth } = require('./private/password');
const { mainCommands } = require('./utils/commands');
const { addHangmanClient } = require('./commands/main-commands');

const options = {
    options: {
        debug: true,
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: 'PlayHangmanBot',
        password: hangmanBotOAuth,
    },
    channels: ['PlayHangmanBot'],
};

const client = new tmi.client(options);
client.connect();

client.on('message', (channel, user, message, self) => {
	// Ignore self messages and non-commands.
	if(self || !message.startsWith("!")) return;

    // Username + unique ID of command user.
    const name = user["display-name"];
    const id = user["user-id"];
    const props = { client, channel, name, id };


    /* Dictionary list of explicit commands */
    const chatCommands = {
        [mainCommands.ADD]: () => addHangmanClient(props)
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

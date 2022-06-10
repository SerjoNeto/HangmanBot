const tmi = require('tmi.js');
const  { hangmanBotOAuth } = require('./misc/password');

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

const hangmanClient = new tmi.client(options);
hangmanClient.connect();

hangmanClient.on('message', (channel, user, message, self) => {
	// Ignore echoed messages.
	if(self || !message.startsWith("!")) return;

	if(message.toLowerCase() === '!hello') {
		hangmanClient.say(channel, `@${user.username}, heya!`);
	}
});

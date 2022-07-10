# Hangman Twitch Bot

A very fun Twitch Bot that allows anybody to play [Hangman](https://en.wikipedia.org/wiki/Hangman_(game)) on their Twitch channel with their viewers.

## Too Long: Didn't Read

- Go to [PlayHangmanBot Twitch channel](https://www.twitch.tv/playhangmanbot), type `!start` in the chat. Add PlayHangmanBot as a moderator in your own Twitch channel.
- Type `!start` to start a Hangman game.
- Use `!guess <word/letter>` like `!guess s` to play.
- Change some settings like cooldown, only subs can play, etc.
- See scores with `!leaderboard`, `!stats`, `!wins`.
- Have fun!

## Installation (For Twitch Users)

The instructions below are for Twitch streamers/users who want to add Hangman to their Twitch channel in less than 1 minute.

1. Go to the [PlayHangmanBot Twitch channel](https://www.twitch.tv/playhangmanbot).
2. In the PlayHangmanBot channel chat, type `!add`. If successful, you should get a message telling you so in chat.
3. Go to your own Twitch channel and check your chat. PlayHangmanBot should say it is live in your channel.
4. Add the PlayHangmanBot channel as a moderator. This is done because moderators are not subject to any Twitch anti-spam filters.
5. Enjoy a game of Hangman by typing `!start`.

## Installation (For Developers)

The instructions below are for developers who want to clone this repository and try running it locally.

1. Make sure you have [node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed on your local machine. 
2. This repo uses tmi.js, so make sure you do `npm i tmi.js`. Familiarize yourself on [tmi.js](https://tmijs.com/).
3. Clone the repository.
4. In `bot.js`, find `const hangmanChannel = 'PlayHangmanBot';` and change `PlayHangmanBot` to the name of your Twitch Bot. Also, change `password: hangmanBotOAuth,` to the authorization token of your Twitch Bot. If you are not sure what I mean, simply click [here](https://twitchapps.com/tmi/) to generate one for your Twitch Bot.
5. In `new-hangman.client.js`, change the same password line as in step 4.
6. Run with `node bot.js`. If you seeing missing directory errors, that is because I have some files in `.gitignore` that you can add personally so the logs/saved files can be saved correctly.

## Usage

## Commands

## Versions

## Creator

## License



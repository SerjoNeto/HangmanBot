# Hangman Twitch Bot

A very fun Twitch Bot that allows anybody to play [Hangman](https://en.wikipedia.org/wiki/Hangman_(game)) on their Twitch channel with their viewers.

## Too Long: Didn't Read

- Go to [PlayHangmanBot Twitch channel](https://www.twitch.tv/playhangmanbot), type `!add` in the chat. Add PlayHangmanBot as a moderator in your own Twitch channel.
- Type `!start` on your Twitch channel to start a Hangman game.
- Anybody in your chat can use `!guess <word/letter>` like `!guess s` to play. 
- Change some settings like guess cooldowns, sub only mode, auto play, etc.
- See scores with `!leaderboard`, `!stats`, `!wins`.
- Have fun!

## Installation (For Twitch)

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
4. In `bot.js`, find `const hangmanChannel = 'PlayHangmanBot';` and change `PlayHangmanBot` to the name of your Twitch Bot. Also, change `password: hangmanBotOAuth,` to the authorization token of your Twitch Bot. If you are not sure what I mean, simply click [here](https://twitchapps.com/tmi/) to generate one for your Twitch Bot. Also remove the `hangmanBotOAuth` import.
5. In `new-hangman.client.js`, change the same password line as in step 4.
6. Run with `node bot.js`. If you seeing missing directory errors, that is because I have some files in `.gitignore` that you can add personally so the logs/saved files can be saved correctly.

## Usage

This bot allows any Twitch user to install a bot that can play Hangman on their channel. If you are familiar with SeryBot, it works very similarly to how it functions.

Follow the **Installation (For Twitch)** guide above on how to install the Bot on your Twitch channel. 

After you have successfully install the bot, there a several things you can do.

### Play A Game

To start a Hangman game, type `!start` on your Twitch channel (owner and mods only). The bot should tell you a new Hangman game has started, with how many letters the hidden words has, along with the lives.

To play, the main command to use is `!guess`. 

If you wish to guess a letter, simply do `!guess <letter>` like `!guess a` in chat. The bot will respond with if the letter is in the word, and replaces the `-` in the word with the places the letters are.

If you wish to guess a word, also use `!guess <word>` like `!guess computer` in chat. The bot will tell you if that is the correct answer or not.

Please note you can only guess alphabetical characters, and make sure the word you guess matches the length of the word!

Like a usual Hangman, the game ends either when there have been 6 incorrect guesses or the correct word is guessed. After a game has finished, you can keep starting as many games as you want.

### Change the Settings

**NOTE: ALL COMMANDS IN THIS SECTION CAN ONLY BE USED BY A TWITCH CHANNEL'S OWNERS AND MODERATORS!**

There are four settings that can be changed currently. To check all the current settings on the bot, use `!settings`. 

1. **Letter Guess Cooldown**- If you feel like people are guessing letters to quickly, you can add a cooldown (in seconds) a user has before they can guess another letter. Use `!letter` to see the current letter guess cooldown in seconds, and you can change it by `!letter <seconds between 0-3600>`, like `!letter 60` for a 60 second letter cooldown. This setting cannot be changed during a Hangman game, so make sure you have no active games before changing this!
2. **Word Guess Cooldown**- Same as letter guess cooldown but with words. The commands are `!word`, or `!word <seconds between 0-3600>`.
3. **Sub Only Games**- If you only want your Twitch subscribers to play Hangman (all tiers), you can change your Hangman games to sub only mode. Use `!subonly` to see the current sub only status. Turn on sub only games with `!subonly on` and turn off with `!subonly off`.
4. **Auto Start Games**- If you are tired of typing `!start` every time a Hangman games end in chat to start a new one, you can set the bot to automatically start a new Hangman game immediately after the previous one ended. Use `!auto` to check the current auto start status. Turn on auto start games with `!auto on` and turn off with `!auto off`.
5. **Error Messages**- If you are tired of people spamming Hangman guesses and the bot telling the user why their guess is invalid (still on cooldown, already guessed letter, word length not right, etc.), you can turn this off with `!error off` and on with `!error on`, and check the current state of error message display with `!error`.

### Check The Leaderboards

Every time somebody correct guesses a word, their wins go on the Hangman scoreboard. Compete to be the best Hangman player on the channel!

You can check your current number of wins and placements with `!win`.

You can check the current leadeboard with `!leaderboard`.

## List Of Commands

### PlayHangmanBot

The following commands below are for the PlayHangmanBot Twitch channel. All users must first come to the chat there and add the bot to their channel.

- **!add**- Adds a Hangman Bot to your Twitch channel.
- **!remove**- Removes the Hangman Bot from your channel if you no longer wish to have it. Note: If there were any Hangman games running, all progress will be lost. However, the scoreboard and settings information will be saved so if you wish to add the bot again, you can start right back with all the old scoreboards and settings.
- **!transfer**- If you changed your Twitch username, you have to type `!transfer` here to transfer your saved information to your new Twitch channel. Even capitalizations count!

### Your Channel's Hangman Bot

The following commands are used on your stream for Hangman.

**Broadcaster & Moderator Only Commands**

- **!start**- Command to start a Hangman game.
- **!end**- Command to end a Hangman game that is currently in progress.
- **!letter**- Command for letter cooldowns. Use `!letter` to check the current time in seconds a user has to wait before they can guess another letter. Use `!letter <number between 0-3600>` like `!letter 30` to set the time in seconds. This setting cannot be changed during a Hangman game, so make sure you have no active games before changing this!
- **!word**- Command for word cooldowns. Use `!word` to check the current time in seconds a user has to wait before they can guess another word. Use `!word <number between 0-3600>` like `!word 60` to set the time in seconds. I generally recommend setting this higher than the letter cooldown. This setting cannot be changed during a Hangman game, so make sure you have no active games before changing this!
- **!subonly**- Command for sub only Hangman games. If this is turned on, only subscribers can play Hangman through guesses. Use `!subonly` to see the current sub only state, and use `!subonly on` to turn on sub only mode, or `!subonly off` to turn off sub only mode.
- **!auto**- Command for auto start Hangman games. If this is turned on, a new Hangman game will automatically start once the previous game is finished, instead of having to type `!start` every time. Use `!auto` to see the current auto play state, and use `!auto on` to turn on auto play mode, or `!auto off` to turn off auto play mode.
- **!error**- Command for whether or not to show error messages for Hangman guesses. If this is turned on, the user will be informed the reason why their guess was invalid. Otherwise, the bot will not tell why a guess failed to save space. Use `!error` to see the current error message display state, and use `!error on` to turn on error messages, or `!error off` to turn off error message displays. 
- **!settings**- Command to check the current Hangman Bot settings for letter/word cooldown, sub only state and auto play state.

**Commands for Everybody**

- **!guess**- Used to play Hangman. Use `!guess <letter>` like `!guess a` to guess a letter. Use `!guess <word>` like `!guess salmon` to guess a word. 
- **!wins**- Used to check how many Hangman games that user has won and their placement on the Hangman leaderboard.
- **!stats**- Check how many Hangman games total has been played on the channel and how many of those games are wins.
- **!leaderboard**- Check to see the top 10 players of Hangman on the channel.
- **!hangman**- Check the current status of Hangman on the channel.
- **!help**- Gives a link to this GitHub repository for anybody who needs help.

## Versions

- **1.0.0** : First Release. 

## FAQs

**Question: I changed my Twitch username and Hangman isn't working anymore.**

**Answer:** You have to go to PlayHangmanBot and type `!transfer` in the chat to transfer your the bot over to your new channel. If that fails, simply `!remove` and `!add`. If that doesn't work, contact me.

**Question: Why does it say "Invalid !guess usage"?**

**Answer:** There could be many reasons. Make sure you are only guess alphabetical characters. Also make sure if you are guessing the word, the length of your guess matches, otherwise it will not work.

## Contact Me

**SHAMELESS PLUG: CHECK OUT MY [TWITCH CHANNEL](https://www.twitch.tv/capk999)!**

If you want to talk to me about this repository, email me at `acnhdatabase2020@gmail.com`. 

## Contributing
If you like to help contribute to helping me improve this repository, feel free to clone my repository and make a pull request! Even if you do not have any programming experience, you are free to suggest new features and they may be added into a future version! 

For major changes, please talk to me directly and make sure you can explain what you are doing and why it is needed.

## License
[MIT](https://choosealicense.com/licenses/mit/)

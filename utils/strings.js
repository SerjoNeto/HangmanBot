/**
 * Replaces possible username "$user" with current user.
 * @param {Strin} winner The winner of the current Hangman.
 * @param {String} winMessage Win message to parse and change
 */
function winMessageBuilder(winner, winMessage) {
    return winMessage.replaceAll('$user', winner);
}

module.exports = {
    winMessageBuilder
};
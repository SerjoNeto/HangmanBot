/**
 * Checks if a user has admin privileges to change Hangman settings, start/end games.
 * @param {Object} user Object with parameters about the user
 * @returns {Boolean} True if admin privileges, false if not.
 */
exports.isAdmin = (user) => {
    return user.badges && ('broadcaster' in user.badges || 'moderator' in user.badges);
};

/**
 *Checks if user is a subscriber to the channel.
 * @param {Object} user Object with parameters about the user
 * @returns {Boolean} True if sub, false if not.
 */
exports.isSub = (user) => {
    return user.badges && ('subscriber' in user.badges|| 'founder' in user.badges);
};
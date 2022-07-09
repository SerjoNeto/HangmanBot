/**
 * Adds ordinal suffix to numbers. 1 -> 1st, 2 -> 2nd, 3-> 3rd, etc.
 * @param {Integer} i Integer to be used
 * @returns String with integer and ordinal suffix.
 */
function ordinalSuffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

/**
 * Convert a fraction into a percentage with 2 decimal places.
 * @param {int} portion Numerator
 * @param {int} total Denominator
 */
function convertPercentage(portion, total) {
    if (portion === 0 || total === 0) {
        return '0.00%';
    }
    return ((portion/total) * 100).toFixed(2) + '%';
}

module.exports = {
    ordinalSuffix,
    convertPercentage
};
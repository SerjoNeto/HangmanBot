/**
 * File used to check parameters types.
 */


/**
 * Check if a value is an integer
 * @param {any} value Value to check if it is an integer
 * @returns {boolean} True if integer, false if not
 */
exports.isInt = (value) => {
   return !isNaN(value) &&  parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}
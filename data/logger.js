const log4js = require('log4js');

class Logger {
    #logger;

    constructor(id, name) {
        log4js.configure({
            appenders: { 
                everything: { type: "dateFile", filename: `./logs/${id}/hangman-log.log` } 
            },
            categories: { 
                default: { appenders: ["everything"], level: "debug" } 
            }
        });
        this.#logger = log4js.getLogger(`${name}`);
    }

    printToLog(user, message) {
        this.#logger.debug(`${user}: ${message}`);
    }
}

module.exports = {
    Logger
}
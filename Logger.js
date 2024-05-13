const fs = require('fs');
const EventEmitter = require('events');

class Logger extends EventEmitter {
    constructor(apiName, logFilePath) {
        super();
        if (!logFilePath) {
            throw new Error('Missing log file path for Logger');
        }
        this.apiName = apiName;
        this.logFilePath = logFilePath;
    }

    log(level, logString) {
        const timestamp = new Date().toISOString();
        const logData = {
            level,
            log_string: logString,
            timestamp,
            api: this.apiName
        };
        fs.appendFile(this.logFilePath, JSON.stringify(logData) + '\n', (err) => {
            if (err) {
                console.error(`Error writing to log file ${this.logFilePath}: ${err}`);
            } else {
                this.emit('logged', logData); // Emit 'logged' event
            }
        });
    }
}

module.exports = Logger;

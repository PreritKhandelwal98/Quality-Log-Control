const fs = require('fs');
const readline = require('readline');

function searchLogs(logFilePath, query) {
    const fileStream = fs.createReadStream(logFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const filters = {
        level: query.level || [],
        log_string: query.logString || '',
        timestamp: query.timestamp || ''
    };

    rl.on('line', (line) => {
        const logData = JSON.parse(line);
        if (matchesFilters(logData, filters)) {
            console.log(logData);
        }
    });

    rl.on('close', () => {
        console.log('End of log file reached.');
    });
}

function matchesFilters(logData, filters) {
    for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
            if (key === 'timestamp' && filters[key] && !matchesTimestamp(logData.timestamp, filters.timestamp)) {
                return false;
            }
            if (key === 'level' && filters[key].length > 0 && !filters[key].includes(logData[key])) {
                return false;
            }
            if (key === 'log_string' && filters[key] && !logData[key].includes(filters[key])) {
                return false;
            }
        }
    }
    return true;
}

function matchesTimestamp(logTimestamp, filterTimestamp) {
    const logDate = new Date(logTimestamp);
    const filterDate = new Date(filterTimestamp);
    return logDate >= filterDate;
}

module.exports = searchLogs;

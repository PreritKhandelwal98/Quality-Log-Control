const readline = require('readline');
const fs = require('fs');
const searchLogs = require('./QueryInterface');

const logFilePath = 'log1.log';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser() {
    rl.question('Enter search query (format: key=value) or type "filter" to apply filter: ', (input) => {
        if (input.trim().toLowerCase() === 'filter') {
            applyFilter();
        } else {
            const [key, value] = input.split('=');
            const searchQuery = { [key]: value };
            searchLogs(logFilePath, searchQuery);
            promptUser(); // Prompt user again for another query
        }
    });
}

function applyFilter() {
    const filters = {};
    rl.question('Enter log level: ', (level) => {
        filters.level = level;
        rl.question('Enter log string: ', (logString) => {
            filters.log_string = logString;
            rl.question('Enter timestamp (optional, leave empty to skip): ', (timestamp) => {
                filters.timestamp = timestamp;
                rl.question('Enter API name: ', (api) => {
                    filters.api = api;
                    searchLogs(logFilePath, filters);
                    promptUser(); // Prompt user again for another query
                });
            });
        });
    });
}

// Start prompting the user for search queries or filters
promptUser();

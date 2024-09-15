const utils = require('./test/helpers/utils')

// Define the global API URL
global.apiServer = 'https://petstore.swagger.io'

// Define the log file name prefix
global.globalLogFileName = "unnamed"

// Clear logs at the start of each test run
utils.clearLogs()

module.exports = {
    spec: "test/specs/**/*.js",   
    timeout: 5000,                
    recursive: true
}
const serverless = require('serverless-http');
const app = require('../index'); // your Express app

module.exports = serverless(app);

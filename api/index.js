// api/index.js
const serverless = require('serverless-http');
require('dotenv').config({ path: 'config.env' });

const app = require('../index'); // your Express app

module.exports.handler = serverless(app);

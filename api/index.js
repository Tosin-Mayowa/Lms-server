const serverless = require("serverless-http");
const app = require("../index"); // adjust path if different

module.exports = serverless(app);

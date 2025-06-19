const twilio = require('twilio');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const sender = process.env.PHONE_NUMBER;
const client = new twilio(accountSid, authToken);



async function sendSMS(to, code) {
  await client.messages.create({
    body: `Your verification code is ${code}`,
    from: sender,
    to,
  });
}

module.exports = sendSMS;

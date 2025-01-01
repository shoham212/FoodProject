const express = require('express');
const { google } = require('googleapis');
const open = require('open');
require('dotenv').config();

const app = express();

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.send'],
});

console.log('Authorize this app by visiting this url:', authUrl);
open(authUrl);

app.get('/', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.send('No authorization code found.');
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Your refresh token is:', tokens.refresh_token);
    res.send('Authorization successful! You can close this tab.');
  } catch (error) {
    console.error('Error retrieving access token:', error);
    res.send('Error retrieving access token.');
  }
});

app.listen(80, () => {
  console.log('Listening on http://localhost');
});

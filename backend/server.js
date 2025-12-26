require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let BOT_TOKEN = null;

/* STEP 1: Redirect to Slack Login */
app.get('/login', (req, res) => {
  const url =
    `https://slack.com/oauth/v2/authorize?client_id=${process.env.CLIENT_ID}` +
    `&scope=chat:write,channels:read,users:read` +
    `&redirect_uri=https://shantell-ooziest-overinterestedly.ngrok-free.dev/slack/callback`;

  res.redirect(url);
});

/* STEP 2: OAuth Callback */
app.get('/slack/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      'https://slack.com/api/oauth.v2.access',
      null,
      {
        params: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
          redirect_uri: 'https://shantell-ooziest-overinterestedly.ngrok-free.dev/slack/callback'
        }
      }
    );

    BOT_TOKEN = response.data.access_token;
    res.redirect('http://localhost:5500/frontend/index.html');
  } catch (err) {
    res.send('OAuth Failed');
  }
});

/* STEP 3: Send Message */
app.post('/send-message', async (req, res) => {
  if (!BOT_TOKEN) {
    return res.json({ ok: false, error: 'Not authenticated' });
  }

  const { channel, text } = req.body;

  try {
    const response = await axios.post(
      'https://slack.com/api/chat.postMessage',
      { channel, text },
      {
        headers: {
          Authorization: `Bearer ${BOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

app.get('/status', (req, res) => {
  res.json({ loggedIn: BOT_TOKEN !== null });
});
 
/* LOGOUT */
app.post('/logout', (req, res) => {
  BOT_TOKEN = null; // Clear the token
  res.json({ ok: true });
});


app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});

console.log("CLIENT_ID:", process.env.CLIENT_ID);

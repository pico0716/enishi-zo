const crypto = require('crypto');

const cookie = (name, value, secure = true) => `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure ? '; Secure' : ''}`;
const base64url = value => value.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

module.exports = async (req, res) => {
  const clientId = process.env.X_CLIENT_ID;
  const appUrl = process.env.APP_URL;
  if (!clientId || !appUrl) return res.status(503).json({ error: 'X OAuth is not configured yet.' });

  const state = base64url(crypto.randomBytes(32));
  const verifier = base64url(crypto.randomBytes(48));
  const challenge = base64url(crypto.createHash('sha256').update(verifier).digest());
  const redirectUri = `${appUrl}/api/x/callback`;
  const query = new URLSearchParams({
    response_type: 'code', client_id: clientId, redirect_uri: redirectUri,
    scope: 'users.read tweet.read follows.read', state,
    code_challenge: challenge, code_challenge_method: 'S256'
  });

  res.setHeader('Set-Cookie', [cookie('enishi_x_state', state), cookie('enishi_x_verifier', verifier)]);
  res.status(200).json({ authUrl: `https://x.com/i/oauth2/authorize?${query}` });
};

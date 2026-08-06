const parseCookies = value => Object.fromEntries((value || '').split(';').map(x => x.trim().split('=').map(decodeURIComponent)).filter(x => x[0]));
const cookie = (name, value, age, secure = true) => `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${secure ? '; Secure' : ''}`;

module.exports = async (req, res) => {
  const { code, state, error } = req.query;
  const { enishi_x_state: expectedState, enishi_x_verifier: verifier } = parseCookies(req.headers.cookie);
  const appUrl = process.env.APP_URL;
  if (error || !code || !state || state !== expectedState || !verifier || !appUrl) return res.redirect('/?x=error');

  const body = new URLSearchParams({ client_id: process.env.X_CLIENT_ID, grant_type: 'authorization_code', code, redirect_uri: `${appUrl}/api/x/callback`, code_verifier: verifier });
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (process.env.X_CLIENT_SECRET) headers.Authorization = `Basic ${Buffer.from(`${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`).toString('base64')}`;
  const response = await fetch('https://api.x.com/2/oauth2/token', { method: 'POST', headers, body });
  const token = await response.json();
  if (!response.ok || !token.access_token) return res.redirect('/?x=error');

  res.setHeader('Set-Cookie', [cookie('enishi_x_token', token.access_token, token.expires_in || 7200), cookie('enishi_x_state', '', 0), cookie('enishi_x_verifier', '', 0)]);
  res.redirect('/?x=connected');
};

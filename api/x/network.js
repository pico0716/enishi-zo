const parseCookies = value => Object.fromEntries((value || '').split(';').map(x => x.trim().split('=').map(decodeURIComponent)).filter(x => x[0]));
const xGet = async (path, token) => fetch(`https://api.x.com/2${path}`, { headers: { Authorization: `Bearer ${token}` } });

module.exports = async (req, res) => {
  const token = parseCookies(req.headers.cookie).enishi_x_token;
  if (!token) return res.status(401).json({ error: 'Not connected to X.' });
  try {
    const meResponse = await xGet('/users/me?user.fields=profile_image_url,name,username', token);
    const me = await meResponse.json();
    if (!meResponse.ok) throw new Error('Unable to load X profile');
    const followingResponse = await xGet(`/users/${me.data.id}/following?max_results=20&user.fields=profile_image_url,name,username`, token);
    const following = await followingResponse.json();
    res.status(200).json({ me: me.data, people: following.data || [] });
  } catch (error) { res.status(502).json({ error: error.message }); }
};

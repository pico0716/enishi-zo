# X OAuth setup

1. Create an app in the X Developer Portal and enable OAuth 2.0 Authorization Code with PKCE.
2. Add this callback URL: `https://enishi-zo.vercel.app/api/x/callback`
3. In Vercel → Project → Settings → Environment Variables, add the values in `.env.example`.
4. Redeploy the project.

The app requests only `users.read`, `tweet.read`, and `follows.read`. It does not request DMs or posting permissions.

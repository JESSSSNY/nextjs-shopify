// api/oauth-callback.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing code');
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: '你的 Google Client ID',
      client_secret: '你的 Google Client Secret',
      redirect_uri: 'https://survivortoys.com/oauth/callback',
      grant_type: 'authorization_code'
    })
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return res.status(500).send('Token exchange failed');
  }

  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });

  const userInfo = await userInfoRes.json();

  // 你可以将用户信息写入 session / 跳转登录成功页
  res.send(`
    <h1>登录成功</h1>
    <p>Email: ${userInfo.email}</p>
    <p>Name: ${userInfo.name}</p>
    <p><img src="${userInfo.picture}" width="80"></p>
  `);
}

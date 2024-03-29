import cookie from 'cookie';
import { fetchJson } from '../../lib/api';

const { CMS_URL } = process.env;

async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const { email, password } = req.body;
  try {
    const { jwt, user } = await fetchJson(`${CMS_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    res.status(200)
    .setHeader('Set-Cookie', cookie.serialize('jwt', jwt, {
      path: '/api',
      httpOnly: true,
    }))
    .json({
      id: user.uuid,
      name: user.name,
      role: user.role,
      shortID: user.shortID,
    });
  } catch (err) {
    res.status(401).end();
  }
}

export default handleLogin;

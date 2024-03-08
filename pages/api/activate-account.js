import { fetchJson } from '../../lib/api';

const { CMS_URL } = process.env;

async function handleActivate(req, res) {
  const { password, token } = req.body;

  console.log("password:",password);
  console.log("token:",token);
  try {
    const user = await fetchJson(`${CMS_URL}/api/activate-account`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    res.status(200)
    .json({
        id: user.id,
        name: user.username,
        role: user.role,
    });
  } catch (err) {
    console.log("[activate account] the error is:", err);
    res.status(401).end();
  }
}

export default handleActivate;
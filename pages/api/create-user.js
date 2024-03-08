import { fetchJson } from '../../lib/api';

const { CMS_URL } = process.env;

async function handleCreateUser(req, res) {

  const { jwt } = req.cookies;

  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }
  const { name, email } = req.body;

  console.log(name, email);
  try {
    const user = await fetchJson(`${CMS_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });
    res.status(200)
    .json({
      id: user.uuid,
      name: user.name,
      role: user.role,
      shortID: user.shortID,
    });
  } catch (err) {
    console.log("error:", err);
    res.status(401).end();
  }
}

export default handleCreateUser;

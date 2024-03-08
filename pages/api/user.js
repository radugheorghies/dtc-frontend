import { fetchJson } from '../../lib/api';

const { CMS_URL } = process.env;

async function handleUser(req, res) {
  const { jwt } = req.cookies;
  if (!jwt) {
    res.status(401).end();
    return;
  }
  try {
    console.log("fetch:",CMS_URL+ "/api/myuser");
    
    const user = await fetchJson(`${CMS_URL}/api/myuser`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });

    // console.log("api my user:", user)

    res.status(200).json({
      id: user.uuid,
      name: user.name,
      role: user.role,
      shortID: user.shortID,
    });
  } catch (err) {
    res.status(401).end();
  }
}

export default handleUser;

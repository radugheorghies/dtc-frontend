import { fetchJson } from '../../lib/api';

const { CMS_URL } = process.env;

async function handleCreateUser(req, res) {

  const { jwt } = req.cookies;

  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { nui, tipP, reset, data, nrminute, destAmef, urlz } = req.body;
 
  try {
    const profile = await fetchJson(`${CMS_URL}/api/profiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({nui, tipP, reset, data, nrminute, destAmef, urlz}),
    });
    res.status(200)
    .json({
      nui: profile.nui,
    });
  } catch (err) {
    console.log("error:", err);
    res.status(401).end();
  }
}

export default handleCreateUser;

import { fetchJson } from '../../lib/api';

const { CMS_URL } = process.env;

function generateParams(params) {
    const paramsArray = params.split("&");
    const result = new Object;
    paramsArray.map((item)=>{
      const values=item.split("=");
      result[values[0]] = values[1];
    })
  
    return result;
}

async function handleGetProfiles(req, res) {
    const { jwt } = req.cookies;
    const params = generateParams(req.url.split("?")[1]);
  
    if (!jwt) {
      res.status(401).end();
      return;
    }
  
    try {
      const profiles = await fetchJson(`${CMS_URL}/api/profiles?page=${params.page}&count=${params.count}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });
      res.status(200).json(profiles);
    } catch (error) {
      console.log("error:", error);
      res.status(401).end();
    }
}

export default handleGetProfiles;
import { fetchJson } from '../../lib/api';

const { CMS_URL } = process.env;

async function handleGetUser(req, res) {
  const { jwt } = req.cookies;
  if (!jwt) {
    res.status(401).end();
    return;
  }
  try {
    const user = await fetchJson(`${CMS_URL}/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(401).end();
  }
}

async function handleGetUsers(req, res, page, count) {
  const { jwt } = req.cookies;

  if (!jwt) {
    res.status(401).end();
    return;
  }

  try {
    const users = await fetchJson(`${CMS_URL}/api/users?page=${page}&count=${count}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.log("error:", error);
    res.status(401).end();
  }
}

async function handleUserStatus(req, res, uuid, action) {
  const { jwt } = req.cookies;

  if (!jwt) {
    res.status(401).end();
    return;
  }

  try {
    const item = await fetchJson(`${CMS_URL}/api/users/${uuid}/${action}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });
    res.status(200).json(item);
  } catch (error) {
    console.log("error:", error);
    res.status(401).end();
  }
}

function generateParams(params) {
  const paramsArray = params.split("&");
  const result = new Object;
  paramsArray.map((item)=>{
    const values=item.split("=");
    result[values[0]] = values[1];
  })

  return result;
}

async function handleUsers(req, res) {
  const params = generateParams(req.url.split("?")[1]);
  switch (params.action) {
    case "getUser":
      return handleGetUser(req, res);
    case "getUsers":
      return handleGetUsers(req, res, params.page, params.count);
    case "deactivate":
      return handleUserStatus(req, res, params.uuid, "deactivate");
    case "activate":
      return handleUserStatus(req, res, params.uuid, "activate");
    case "admin":
      return handleUserStatus(req, res, params.uuid, "admin");
    case "technician":
      return handleUserStatus(req, res, params.uuid, "technician");
    
    default:
      res.status(405).end();
  }
}

export default handleUsers;
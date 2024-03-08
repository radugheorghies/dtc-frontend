import fs from 'fs';
import stream from 'stream';
import { promisify } from 'util';
import fetch from 'node-fetch';

const { CMS_URL } = process.env;
const pipeline = promisify(stream.pipeline);

function generateParams(params) {
    const paramsArray = params.split("&");
    const result = new Object;
    paramsArray.map((item)=>{
      const values=item.split("=");
      result[values[0]] = values[1];
    })
  
    return result;
}

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).end();
    }

    const { jwt } = request.cookies;
    const params = generateParams(request.url.split("?")[1]);

    if (!jwt) {
        response.status(401).end();
        return;
    }

    try {
        const profile = await fetch(`${CMS_URL}/api/download/${params.file}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
        });
        response.setHeader('Content-Disposition', `attachment; filename=${params.file}`);
        response.setHeader('Content-Type', 'application/text');

        await pipeline(profile.body, response);
    } catch (error) {
        console.log("error:", error);
        res.status(401).end();
    }
}
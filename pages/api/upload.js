import { fetchJson } from '../../lib/api';
import { NextResponse } from 'next/server';
// import { cookies } from 'next/dist/client/components/headers';
// import { FormData } from 'form-data';
// import FormData from 'form-data';
// import formidable from 'formidable-serverless';

export const config = { runtime: 'edge'};

const { CMS_URL } = process.env;

export default async function POST(req, res) {

  const jwt = req.cookies.get('jwt');

  console.log("jwt:", jwt.value);

  if (req.method !== 'POST') {
    return NextResponse.json({ success: false });
  }
 
  try {
    const formData = await req.formData();
    const file = await formData.getAll('files')[0]

    if (!file) {
        return NextResponse.json(
            { error: "File is required." },
            { status: 400 }
        );
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    // console.log(buffer)

    const data =  new Blob([buffer])
    const fd = new FormData();
    fd.append("files", data)
    // const data = JSON.parse(buffer.toString());
    // console.log(data)

    // const formdata = new FormData();
    // formdata.append("files", await file);

    const result = await fetchJson(`${CMS_URL}/api/upload-certificate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt.value}`,
        },
        body: fd, //JSON.stringify({buffer:buffer.toString()}),
    });
    return NextResponse.json(result);
  } catch (err) {
    console.log("error:", err);
    return NextResponse.json({ success: false, message: err.toString() });
  }
}

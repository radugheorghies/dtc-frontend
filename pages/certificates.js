import Page from '../components/Page';
import { useState, useEffect } from "react";

function Ceritificates() {
    const [uploaded, setUploaded] = useState(false);
    const [file, setFile] = useState();
    const [error, setError] = useState("");
    
    const handleUpload = async () => {
        if (!file) return
        try {
            const formdata = new FormData();
            formdata.append("files", file);
            const response =  await fetch(`/api/upload`, {
                method: 'POST',
                body: formdata,
            });
            const _data = await response.json();

            if (_data.success) {
                setUploaded(true);
                setError("")
            } else {
                setUploaded(false);
                setError(_data.message);
            }
        } catch(err) {
            setUploaded(false);
            setError(err.toString());
        }
    };

    return (
        <Page title="Ceritificates">
            <div>
                <>
                <input
                    className="hadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                />
                <button
                    className='bg-green-800 text-gray-100 rounded px-4 py-2 my-2 hover:bg-green-700'
                    type="button"
                    onClick={handleUpload}
                >
                    Uploa file
                </button>
                </>
                {error!==""?(<p className='font-semibold mt-10 text-red-600'>{error.toString()}</p>):null}
                {uploaded?(<p className='font-semibold mt-10'>The certificate was successfully uploaded !</p>):null}
            </div>
        </Page>
    );
}

export default Ceritificates;

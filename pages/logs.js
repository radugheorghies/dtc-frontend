import Page from '../components/Page';
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

function Logs() {

  const itemsPerPage = 20;
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState([]);
  
  const getData = async (page) => {
    try {
        const response =  await fetch(`/api/logs?page=${page}&count=${itemsPerPage}`);
        const _data = await response.json();
        // console.log("Data is: ", _data);
        setTotalItems(_data.count);
        setLogs(_data.data);
    } catch(err) {
        console.log(err);
    }
};
  
  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    let page = event.selected + 1;
    console.log("page:", page)
    getData(page);
    setCurrentPage(page);
  };

  useEffect(() => {
      console.log("Getting the data")
      getData(currentPage);
  }, []);

  return (
    <Page title="Logs">
      {logs.length?(
        <>
          <button
            className='mt-10 mb-10 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50'
            type="button"
            onClick={()=>getData(currentPage)}
          >
            Refresh data
          </button>
          <table className="table-auto w-full min-w-[58rem] 2xl:min-w-[80rem]">
              <thead className="text-left text-gray-500">
                  <tr>
                      <th className="font-semibold">Date</th>
                      <th className="font-semibold">NUI</th>
                      <th className="font-semibold">Bytes</th>
                      <th className="font-semibold">Text</th>
                  </tr>
              </thead>

              <tbody>
              {logs?.map((item, i) => (
                  <tr key={i} className={`text-left align-top origin-top`}>
                  <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                    {item.createdAt}
                  </td>
                  <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                      {item.name}
                  </td>
                  <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                      {item.email}
                  </td>
                  <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                      {item.role}
                  </td>
                  </tr>
              ))}
              </tbody>
          </table>

          <div className="">
              <ReactPaginate
                  breakLabel="..."
                  onPageChange={event=>handlePageClick(event)}
                  pageCount={Math.ceil(totalItems / itemsPerPage)}
                  nextLabel="next >"
                  nextClassName="bg-gray-200 rounded-md px-2 py-1 text-gray-500"
                  previousClassName="bg-gray-200 rounded-md px-2 py-1 text-gray-500"
                  activeClassName="bg-gray-200 w-6 px-2 py-1 text-center rounded-sm"
                  activeLinkClassName="bg-primary"
                  pageClassName="text-gray-500 w-6 px-2 py-1 text-center rounded-sm"
                  className="flex space-x-4 mt-5"
                  previousLabel="< previous"
                  containerClassName="items-center pagination"
              />
          </div>
        </>
    ):(
      <p className='font-semibold mt-10'>No logs are generated yet.</p>
    )}
    </Page>
  );
}

export default Logs;

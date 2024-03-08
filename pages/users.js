import Page from '../components/Page';
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import Field from '../components/Field';
import CustomInput from '../components/CustomInput';
import { useCreateUser } from '../hooks/user';


function UsersPage() {
    const itemsPerPage = 20;
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    const [roleErrors, setRoleErrors] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const { createUser, createUserError, createUserLoading } = useCreateUser();

    const getData = async (page) => {
        try {
            const response =  await fetch(`/api/users?action=getUsers&page=${page}&count=${itemsPerPage}`);
            const _data = await response.json();
            // console.log("Data is: ", _data);
            setTotalItems(_data.count);
            setUsers(_data.data);
            setErrors(_data.data.map(()=> ""));
            setRoleErrors(_data.data.map(()=> ""));
        } catch(err) {
            console.log(err);
        }
    };

    const onChangeStatus = async(item, index) => {
        // console.log("item:", item);
        const action = item.accountStatus==="active"?"deactivate":"activate";
        setErrors(currentErrors=>currentErrors.map((item, i)=> i===index?"": item));

        try {
            const response =  await fetch(`/api/users?action=${action}&uuid=${item.uuid}`);
            const _data = await response.json();
            getData(currentPage);
            setErrors(_data.data.map(()=> ""));
        } catch(err) {
            console.log("err:", err);
            setErrors(currentErrors=>currentErrors.map((item, i)=> i===index?err.message: item));
        }
    }

    const onChangeRole = async(item, index) => {
        // console.log("item:", item);
        const action = item.role==="technician"?"admin":"technician";
        setRoleErrors(currentErrors=>currentErrors.map((item, i)=> i===index?"": item));

        try {
            const response =  await fetch(`/api/users?action=${action}&uuid=${item.uuid}`);
            const _data = await response.json();
            getData(currentPage);
            setRoleErrors(_data.data.map(()=> ""));
        } catch(err) {
            console.log("err:", err);
            setRoleErrors(currentErrors=>currentErrors.map((item, i)=> i===index?err.message: item));
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("submitting");
        const valid = await createUser(name, email);
        if (valid) {
            getData(currentPage);
            const { element } = HSOverlay.getInstance('#hs-cookies', true);
            element.close();
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
    }, [currentPage]);


    return (
        <Page title="Users">
        <div className="overflow-x-scroll mt-1 mb-20">

            <button type="button" className="mb-5 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-cookies">
                Add user
            </button>

            <div id="hs-cookies" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
                <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                    
                        <div className="relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-gray-800">
                            <div className="absolute top-2 end-2">
                                <button type="button" className="flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-cookies">
                                <span className="sr-only">Close</span>
                                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="basis-1/4">

                            <div className="p-4 sm:p-14 overflow-y-auto">
                                <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
                                    Create user
                                </h3>
                                    <Field label="Name">
                                        <CustomInput type="text" required value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        />
                                    </Field>

                                    <Field label="Email">
                                        <CustomInput type="email" required value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        />
                                    </Field>
                                

                                    <p className="text-gray-800 dark:text-gray-400">
                                        An email with all details will be sent to the user to access the account.
                                    </p>
                            </div>

                            <div className="flex justify-end items-left gap-x-2 py-3 px-4 border-t dark:border-gray-700">
                                <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" data-hs-overlay="#hs-cookies">
                                    Cancel
                                </button>
                                <button type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                    Create user
                                </button>
                            </div>

                            </form>

                        </div>
                    
                </div>
            </div>
            
        
            <table className="table-auto w-full min-w-[58rem] 2xl:min-w-[80rem]">
                <thead className="text-left text-gray-500">
                    <tr>
                        <th className="font-semibold">NAME</th>
                        <th className="font-semibold">EMAIL</th>
                        <th className="font-semibold">ROLE</th>
                        <th className="font-semibold">Change Role</th>
                        <th className="font-semibold">Change Status</th>
                    </tr>
                </thead>

                <tbody>
                {users?.map((item, i) => (
                    <tr key={i} className={`text-left align-top origin-top`}>
                    <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                        {item.name}
                    </td>
                    <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                        {item.email}
                    </td>
                    <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                        {item.role}
                    </td>
                    <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                        {!(item.role==="super-admin")?(
                            <button className='text-gray-500 px-2 py-1 text-center rounded-xl bg-gray-200 '
                                onClick={()=>onChangeRole(item, i)}
                            >
                                {item.role==="admin"?(
                                    "Make tehnician"
                                ):(
                                    "Make admin"
                                )}
                            </button>
                        ):(<></>)}
                        {roleErrors[i]&&
                        <p className="text-sm text-third text-left text-red-800">{roleErrors[i]}</p>}
                    </td>
                    <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                        {!(item.role==="super-admin")?(
                            item.accountStatus!=="pending"?(
                            <button className='text-gray-500 px-2 py-1 mb-1 text-center rounded-xl bg-gray-200 '
                                onClick={()=>onChangeStatus(item, i)}
                            >
                                {item.accountStatus==="active"?(
                                    "Deactivate"
                                ):(
                                    "Activate"
                                )}
                            </button>):(<p>not available</p>)
                        ):null}
                        {errors[i]&&
                        <p className="text-sm text-third text-left text-red-800">{errors[i]}</p>}
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
        </div>
        </Page>
    );
}

export default UsersPage;
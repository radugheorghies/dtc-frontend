import Page from '../components/Page';
import Field from '../components/Field';
import Input from '../components/Input';
import Select from '../components/Select';
import DatePicker from 'react-datepicker';
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import { useUser } from '../hooks/user';
import { useCreateProfile } from '../hooks/profiles';
import "react-datepicker/dist/react-datepicker.css";


function NuiGenerator() {

  const user = useUser();

  const initialState = {
    nui: '',
    nrminute: '30',
    tipP: '1',
    destAmef: '1',
    reset: '0',
    data: new Date().toISOString(),
    urlz: '',
    isSubmitting: false,
    isSubmittingProfile: false,
    errorMessage: null
  };

  const itemsPerPage = 20;
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showResults, setShowResults] = useState(true);
  const [showDate, setShowDate] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const { createProfile, createProfileError, createProfileLoading } = useCreateProfile();

  const getData = async (page) => {
    try {
        const response =  await fetch(`/api/profiles?page=${page}&count=${itemsPerPage}`);
        const _data = await response.json();
        // console.log("Data is: ", _data);
        setTotalItems(_data.count);
        setProfiles(_data.data);
    } catch(err) {
        console.log(err);
    }
  };

  const handleChange = event => {
    const { name, value } = event.target;

    setValues({
      ...values,
      [name]: value,
      errorMessage: null
    });

    if (name === 'tipP') {
      if (value === '0') {
        setShowResults(false);
      } else {
        setShowResults(true);
        setValues({
          ...values,
          tipP: value,
          reset: '0',
          showDate: false,
        });
      }
    }

    if (name === 'reset') {
      if (value === '0') {
        setShowDate(false);
        setValues({
          ...values,
          reset: '0'
        });
      } else {
        setShowDate(true);
      }
    }

    if (name === 'nui') {
      if (value.length !== 10) {
        setErrors({
          ...errors,
          [name]: 'Need 10 characters'
        });
      } else {
        setErrors({
          ...errors,
          [name]: null
        });
      }
    }
  };

  const download = (item) => {
    console.log(item)
    fetch('/api/profile?file='+item.nui).then(response => {
      if (response.status !== 200) {
        throw new Error('Sorry, I could not find that file.');
      }
      return response.blob();
    }).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.setAttribute('download', item.nui);
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

  const handleDateChange = (date) => {
    const myDate = new Date(date)
    setValues({
      ...values,
      data: myDate,
      errorMessage: null
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (values.nui.length != 10) {
      setErrors({
        ...errors,
        nui: 'Need 10 characters'
      });
      return false;
    }

    setValues({
      ...values,
      isSubmittingProfile: true,
      errorMessage: null
    });

    const postData = {
      nui: values.nui,
      nrminute: values.nrminute,
      tipP: values.tipP,
      urlz: values.urlz,
      reset: values.reset,
      data: values.reset && values.data,
      destAmef: values.destAmef
    };

    const valid = createProfile(postData);
    // if (valid) {
    getData(currentPage);
    // }

    
  };

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
      let page = event.selected + 1;
      console.log("page:", page)
      getData(page);
      setCurrentPage(page);
  };

  useEffect(() => {
    getData(currentPage);
  }, [currentPage]);

  useEffect(()=>{
    setValues({
      ...values,
      isSubmittingProfile: createProfileLoading,
      errorMessage: createProfileError
    });
  },[createProfileError, createProfileLoading]);

  useEffect(() => {
    if (user) {
      setValues({
        ...values,
        ['urlz']: `http://109.166.217.178:9843/`+user.shortID,
      });
    }
  }, [user]);

  return (
    <Page title="Profiles Generator">
      <div className="grid grid-cols-2 gap-4 mb-20">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-4">
          <div className="witeBoard">
            <h5 className="font-semibold mb-4">Current certificate (eg: ANAF):</h5>
            <p>
              <a href="/anaf.crt" target="_blank" rel="noopener noreferrer" className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
                Download the certificate
              </a>
            </p>
          </div>

          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

          <div className="witeBoard">
              <h5 className="font-semibold">Genereate profile</h5>

              <form onSubmit={handleSubmit}>
                <Field className="textNormal">NUI</Field>
                <Input type="text" name="nui" 
                  {...{handleChange, values, errors}}
                />

                <Field className="textNormal">Profile type</Field>
                <Select placeholder="select" name="tipP" {...{handleChange, values, errors}} >
                  <option value="0">0</option>
                  <option value="1">1</option>
                </Select>

                {showResults ? (
                  <div>
                    <Field className="textNormal"> AMEF Destination </Field>
                    <Select  placeholder="select" name="destAmef" {...{handleChange, values, errors}}>
                      <option value="1">AMEF uzual</option>
                      <option value="2">AMEF schimb valutar</option>
                      <option value="3">AMEF taxi</option>
                      <option value="4">AMEF aeroporturi</option>
                    </Select>

                    <Field className="textNormal">
                      URL AMEF
                    </Field>
                    <Input type="text" name="urlz" disabled {...{handleChange, values, errors}} />
                  </div>
                ) : (
                  <div>
                    <Field className="textNormal">
                      Profile type reset?
                    </Field>
                    <Select placeholder="select" name="reset" {...{handleChange, values, errors}} >
                      <option value="0">Nu</option>
                      <option value="1">Da</option>
                    </Select>
                    {showDate ? (
                      <div>
                        <Field className="textNormal">
                          Date (Mandatory only for profile type reset)
                        </Field>
                        <DatePicker
                          className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                          id="example-datepicker"
                          name="data"
                          autoComplete="off"
                          selected={values.data}
                          onChange={handleDateChange}
                        />
                      </div>
                    ) : null}
                  </div>
                )}

                {values.errorMessage && (
                  <span className="text-red-600">
                    Error creating the profile
                  </span>
                )}
                <div className="m-t-50 m-b-20">
                  <button
                    className='mt-10 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50'
                    type="button"
                    disabled={values.isSubmittingProfile}
                    onClick={handleSubmit}
                  >
                    {values.isSubmittingProfile
                      ? 'GENERATING THE PROFILE...'
                      : 'GENERATE PROFILE'}
                  </button>
                </div>
              </form>
            </div>


        </div>
        </div>

        <div className="">
          <h5 className="font-semibold mb-5">Profiles</h5>

          {profiles?.length?(
          <div className='mt-5'>
          <table className="w-full table-auto">
                <thead className="text-left text-gray-500">
                    <tr>
                        <th className="font-semibold">NUI</th>
                        {/* <th className="font-semibold">Type</th>
                        <th className="font-semibold">Reset</th>
                        <th className="font-semibold">Role</th> */}
                        <th className="font-semibold">action</th>
                    </tr>
                </thead>

                <tbody>
                {profiles?.map((item, i) => (
                    <tr key={i} className={`text-left align-top origin-top`}>
                    <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                        {item.nui}
                    </td>
                    {/* <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                        {item.type}
                    </td>
                    <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                        {item.reset}
                    </td>
                    <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                        {item.role}
                    </td> */}
                    <td className="align-top text-sm border-t-[1px] border-gray-200 pt-3 h-8">
                        {!(item.role==="super-admin")?(
                            <button className='text-gray-500 px-2 py-1 mb-1 text-center rounded-xl bg-gray-200 '
                                onClick={()=>download(item)}
                            >
                                download profile
                            </button>
                        ):(<></>)}
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
          ):(
            <p className='font-semibold mt-10'>No profiles are generated yet.</p>
          )}
        </div>
      </div>
    </Page>
  );
}

export default NuiGenerator;

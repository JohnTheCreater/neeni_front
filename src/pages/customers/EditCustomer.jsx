import React, { useEffect, useState } from "react";
import Search from "../../components/Search";
import Drop from "../../components/Drop";
import api from "../../api/api";
import MessageBoard from "../products/MessageBoard";

const EditCustomer = ({ setIsEdit }) => {

  const genders = ["male", "female", "others"];

  const [gender, setGender] = useState(genders[0]);
  useEffect(() => {

    setFormDetails({ ...formDetails, gender: gender })

  }, [gender])

  const [formDetails, setFormDetails] = useState({});
  const [error, setError] = useState({});
  const [customer, setCustomer] = useState({});
  const [edit, setEdit] = useState(false);
  const [sureRemove, setSureRemove] = useState(false)
  const [isSubmitLoaderOn, setIsSubmitLoaderOn] = useState(false);
  const [isRemoveLoaderOn, setIsRemoveLoaderOn] = useState(false);
  const [messageBoard, setMessageBoard] = useState({ message: "", title: "", state: false });



  useEffect(() => {

    if (Object.keys(customer).length == 0 || !customer.id) {
      return;
    }

    setFormDetails({ ...customer })
    setError({})
    setGender(customer.gender || 'unknown');


  }, [customer])

  const handleNoCustomerError = () => {
    setMessageBoard({ title: "No Customer Found!", message: "Please Select a Customer By Search !", state: true })

  }
  const checkForm = () => {

    if (Object.keys(customer).length == 0 || !customer.id) {
      handleNoCustomerError();

      return;
    }

    const trimmedDetails = {
      ...formDetails,
      name: formDetails?.name?.trim(),
      address: formDetails?.address?.trim(),
      mobileno: formDetails?.mobileno?.trim(),
      city: formDetails?.city?.trim(),
      pincode: formDetails?.pincode?.trim(),
      email: formDetails?.email?.trim()
    };

    let isValid = true;
    const errorDetails = { ...error };

    if (!trimmedDetails.name) {
      errorDetails.name = "Full name is required!";
      isValid = false;
    } else {
      errorDetails.name = undefined;
    }

    if (!trimmedDetails.email) {
      errorDetails.email = "email is required!";
      isValid = false;
    } else {
      errorDetails.email = undefined;
    }


    if (!trimmedDetails.address) {
      errorDetails.address = "Address is required!";
      isValid = false;
    } else {
      errorDetails.address = undefined;
    }

    if (!trimmedDetails.mobileno) {
      errorDetails.mobileno = "Mobile number is required!";
      isValid = false;
    } else {
      errorDetails.mobileno = undefined;
    }

    if (!trimmedDetails.city) {
      errorDetails.city = "City is required!";
      isValid = false;
    } else {
      errorDetails.city = undefined;
    }

    if (!trimmedDetails.pincode) {
      errorDetails.pincode = "Pincode is required!";
      isValid = false;
    } else {
      errorDetails.pincode = undefined;
    }


    return { isValid, trimmedDetails, errorDetails };

  };

  const handleSubmit = async (e) => {


    e.preventDefault();
    setIsSubmitLoaderOn(true);
    const { isValid, trimmedDetails, errorDetails } = checkForm();
    console.log(isValid,trimmedDetails,errorDetails)
    if (!isValid) {
      setError(errorDetails)
      setIsSubmitLoaderOn(false)
      return;
    }

    const customerId = customer.id;
    setFormDetails(trimmedDetails);
    api.put(`/api/customer/${customerId}`, { customer: trimmedDetails })
      .then(result => {
        setFormDetails({});
        setCustomer({});
        setIsEdit(false);
        console.log("Updated successfully");
      })
      .catch(err => {
        setMessageBoard({
          message: err.response?.data?.message || err.message || "Failed to update customer",
          title: "Error",
          state: true
        });
      })
      .finally(() => setIsSubmitLoaderOn(false))

  };


  const handleChange = (e) => {

    let { name, value } = e.target;


    if (
      ["name", "mobileno", "email", "address", "city", "pincode"].includes(
        name
      ) &&
      value.length !== 0
    ) {
      setError({
        ...error,
        [name]: undefined,
      });
    }

    setFormDetails({
      ...formDetails,
      [name]: value,
    });

    
  };

  const handleStatusChange = (is_active) => {

    if (edit)
      setFormDetails({ ...formDetails, is_active: !(is_active) });

  }






  const handleRemove = () => {

    setIsRemoveLoaderOn(true);

    if ( Object.keys(customer).length == 0 || !customer?.id) {
      handleNoCustomerError();
      setIsRemoveLoaderOn(false);
      return;
    }


    const customerId = customer.id;
    api.delete(`/api/customer/${customerId}`)
      .then(result => {

        console.log("customer removed")
        setFormDetails({})
        setCustomer("")
        setSureRemove(false)
        alert("customer removed!")


      })
      .catch(err => {
        setMessageBoard({
          message: err.response?.data?.message || err.message || "Failed to remove customer",
          title: "Error",
          state: true
        });
      })
      .finally(() => setIsRemoveLoaderOn(false))

  }


  const onSearchChange = async (value) => {

    try {
      const result = await api.get(`/api/customer?value=${value}`);
      return result.data || [];
    }
    catch (arr) {
      console.log(err);
      return [];
    }

  }

  return (
    <div className="flex justify-between my-[5%]  min-w-full bg-gray-100  min-h-full">

      {sureRemove && (
        <div className="shadow-xl bg-gray-100 w-[30%] absolute z-20 mx-[34%] flex  flex-col items-center p-3 rounded-box my-[10%] ">
          <div className="text-xl font-bold text-[1.5rem] p-2">Are You Sure!</div>
          <div className="text-center text-[1rem] p-2">you want to remove customer! {formDetails.name.toLocaleUpperCase()}! with the ID of <span className="text-lg">{customer.id}</span>  !</div>
          <div className="w-[50%] flex justify-between ">
            <button
              onClick={() => setSureRemove(false)}
              className="btn btn-error text-white "
            >
              Cancel
            </button>
            <button
              onClick={handleRemove}
              className="btn hover:bg-green-600 bg-green-500 text-white"
            >
              {isRemoveLoaderOn ? <div className="loading loading-spinner"></div> : <span>Ok</span>}


            </button>
          </div>
        </div>
      )}

      {messageBoard.state && (
        <div className="shadow-xl absolute z-20 mx-[34%] flex flex-col items-center p-3 rounded-box my-[10%]">
          <MessageBoard messageBoard={messageBoard} setMessageBoard={setMessageBoard} />
        </div>
      )}


      <div className=" mt-10 ml-10 ">
        <button onClick={() => setIsEdit(false)} className="btn btn-error text-white">
          
          Back
        </button>
      </div>

      <div className=" flex justify-center mt-10">
        <div className="w-[100%]  max-w-[100%] ">

          <div
            className={`glass bg-white  p-5 rounded-[1rem] border-2 transition-all duration-300 relative ${'is_active' in formDetails ? formDetails.is_active ? 'border-green-500' : 'border-red-500' : ''}`}
            style={'is_active' in formDetails ? {
              boxShadow: formDetails.is_active
                ? '0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.15)'
                : '0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.15)'
            } : {}}>

            {/* Status Badge */}


            <div className="flex justify-between">
              {'is_active' in formDetails &&
                <div className={`absolute -top-1  px-3 py-1 rounded-full text-xs font-bold text-white ${formDetails.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                  {formDetails.is_active ? 'ACTIVE' : 'INACTIVE'}
                </div>}

              <div className="flex justify-center w-[70%] z-20">

                <span className="w-[70%]">Search Customer:</span>
                <Search onChange={onSearchChange} selectedItem={customer} setSelectedItem={setCustomer} searchAttribute={'name'} />

              </div>
              <div>
                <span className="p-2">{edit ? "Edit Mode" : "View Mode"}</span>
              </div>
            </div>
            <form
              className="w-full  flex flex-col items-center max-w-lg "
              onSubmit={handleSubmit}
            >
              <div className="flex gap-4 flex-wrap -mx-3 mb-6">
                <div className="flex w-full gap-2">
                  <div className="w-full   md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-xs font-bold mb-2"
                      for="grid-first-name"
                    >
                      Full Name
                    </label>
                    <input
                      className={`appearance-none block w-full bg-gray-200 border ${error.name ? "border-red-500" : ""
                        } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                      id="grid-first-name"
                      type="text"
                      value={formDetails?.name || ""}
                      placeholder="Jane"
                      name="name"
                      onChange={handleChange}
                      disabled={!edit}
                    />

                    {error.name && (
                      <p className=" absolute text-red-500 text-xs italic">
                        {error.name}
                      </p>
                    )}
                  </div>
                  <div className="w-full  md:w-1/4  px-3">
                    <label
                      className="block uppercase tracking-wide text-xs font-bold mb-2"
                      for="grid-gender"
                    >
                      Gender
                    </label>
                    <Drop option={gender} setOption={setGender} list={genders} disabled={!edit} />

                  </div>
                  <div className=" flex flex-col md:w-1/4 items-center ">
                    <input type="checkbox" className="toggle" checked={edit} onChange={() => { setEdit(!edit) }} />


                    <div className="flex flex-col justify-center items-center m-2 ">
                      <span className="w-full p-2">Activate/Deactivate</span>
                      <input type="checkbox" disabled={!edit} className="toggle" checked={formDetails.is_active} onChange={() => { handleStatusChange(formDetails.is_active) }} />
                    </div>


                  </div>
                </div>

                <div className="w-full md:px-3">
                  <label
                    className="block uppercase tracking-wide text-xs font-bold mb-2"
                    for="grid-email"
                  >
                    Email
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 border ${error?.email ? "border-red-500" : "border-gray-200"
                      } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                    id="grid-gstnumber"
                    type="email"
                    placeholder="Enter Your Email...."
                    name="email"
                    value={formDetails?.email || ""}
                    onChange={handleChange}
                    disabled={!edit}

                  />

                  {error.email && (
                    <p className="absolute text-red-500 text-xs italic">
                      {error.email}
                    </p>
                  )}
                </div>


                <div className="w-full md:px-3">
                  <label
                    className="block uppercase tracking-wide text-xs font-bold mb-2"
                    for="grid-email"
                  >
                    gstnumber number:
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 border ${"border-gray-200"} rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                    id="grid-gstnumber"
                    type="text"
                    placeholder="enter gstnumber number"
                    name="gstnumber"
                    value={formDetails?.gstnumber || ""}
                    onChange={handleChange}
                    disabled={!edit}

                  />

                  {/* {error.email && (
                    <p className="absolute text-red-500 text-xs italic">
                      {error.email}
                    </p>
                  )} */}
                </div>
              </div>
              <div className="flex flex -mx-3 mb-6">
                <div className="w-full px-3">
                  <label
                    className="block uppercase tracking-wide text-xs font-bold mb-2"
                    for="grid-mobile"
                  >
                    Mobile number
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 border ${error?.mobileno ? "border-red-500" : "border-gray-200"
                      } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                    id="grid-mobile"
                    type="tel"
                    value={formDetails?.mobileno || ""}
                    name="mobileno"
                    title="Please enter exactly 10 digits"
                    maxLength={10}
                    onChange={handleChange}
                    placeholder="enter 10 digit  mobile no"
                    disabled={!edit}

                  />
                  {error.mobileno && (
                    <p className="absolute text-red-500 text-xs italic">
                      {error.mobileno}
                    </p>
                  )}

                  {/* <p className="text-gray-600 text-xs italic">
                    Make it as long and as crazy as you'd like
                  </p> */}
                </div>

                <div className="w-full px-3">
                  <lable
                    className="block uppercase tracking-wide text-gray=700 text-xs font-bold mb-2"
                    for="address"
                  >
                    {" "}
                    Address
                  </lable>
                  <textarea
                    className={`border max-h-20 min-h-14 p-1 ${error.address ? "border-red-500" : "border-gray-200"
                      }`}
                    id="address"
                    name="address"
                    rows={"2"}
                    value={formDetails?.address || ""}
                    onChange={handleChange}
                    disabled={!edit}

                  />
                  {error.address && (
                    <p className="absolute text-red-500 text-xs italic">
                      {error.address}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-xs font-bold mb-2"
                    for="grid-city"
                  >
                    City
                  </label>
                  <input
                    className={`appearance-none block w-full bg-gray-200 border ${error.city ? "border-red-500" : "border-gray-200"
                      }rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                    id="grid-city"
                    type="text"
                    name="city"
                    value={formDetails?.city || ""}
                    placeholder="madurai..."
                    onChange={handleChange}
                    disabled={!edit}

                  />
                  {error.city && (
                    <p className="absolute text-red-500 text-xs italic">
                      {error.city}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-xs font-bold mb-2"
                    for="grid-state"
                  >
                    State
                  </label>
                  <div className="relative">
                    <select
                      disabled={!edit}
                      className="block appearance-none w-full bg-gray-200 text-black border border-gray-200 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                      onChange={handleChange}
                      name="state"
                      value={formDetails?.state || ""}
                    >
                      <option>Tamil nadu</option>
                      <option>Kerala</option>
                      <option>Andra</option>
                      <option>karnataka</option>


                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-xs font-bold mb-2"
                    for="grid-pincode"
                  >
                    pincode
                  </label>
                  <input
                    onChange={handleChange}
                    className="appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-pincode"
                    type="text"
                    name="pincode"
                    placeholder="90210"
                    value={formDetails?.pincode || ""}
                    disabled={!edit}

                  />
                  {error.pincode && (
                    <p className=" absolute text-red-500 text-xs italic">
                      {error.pincode}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-[50%] flex justify-center ">
                {/* <button type="button" onClick={() => { setEdit(!edit) }} className="btn hover:bg-green-700 text-white bg-green-500">
                  <LuFolderEdit />

                </button> */}

                <button
                  className="bg-green-500 text-white p-2  rounded-[0.3rem]"
                  type="submit"
                  disabled={error.name}
                >
                  {isSubmitLoaderOn ? <div className="loading loading-spinner"></div> :
                    <span>update</span>
                  }
                </button>

              </div>
            </form>
          </div>

        </div>
        <div>
          <button className="btn btn-error text-white" onClick={() => {
            setSureRemove(true)

          }} disabled={!customer?.id}>Remove</button>
        </div>
      </div>
      <div></div>
    </div>
  );
};
export default EditCustomer;

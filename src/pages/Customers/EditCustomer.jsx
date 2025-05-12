import React, { useEffect, useState } from "react";
import axios from "axios";
// import DropdownL from "../Dashboard/DropdownL";
import Search from "../../components/Search";
import { LuFolderEdit } from "react-icons/lu";
import { API_URL } from "../../config";
import Drop from "../../components/Drop";

const EditCustomer = ({ setIsEdit }) => {
  const genders = ["male", "female", "others"];

  const [gender, setGender] = useState(genders[0]);
  useEffect(() => {

    setFormDetails({ ...formDetails, gender: gender })

  }, [gender])

  const [formDetails, setFormDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [userfound, setUserfound] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [NoName, setNoName] = useState(true);
  const [userId, setUserId] = useState(0);
  const [edit, setEdit] = useState(false);
  const [sureRemove, setSureRemove] = useState(false)
  const [isSubmitLoaderOn,setIsSubmitLoaderOn]=useState(false);
  const [isRemoveLoaderOn,setIsRemoveLoaderOn]=useState(false);
  useEffect(() => {
    axios
      .post(`${API_URL}/api/get`, { tableName: "user" })
      .then((result) => {
        setCustomerList(result.data);
       
      })
      .catch((err) => console.log(err));
  }, [sureRemove]);

  // useEffect(() => {
  //   console.log("con", customerList);
  // }, [customerList]);
  // //submit
  const checkForm = async() => {
    const trimmedDetails = {...formDetails,
      name: formDetails?.name?.trim(),
      address: formDetails?.address?.trim(),
      mobileno: formDetails?.mobileno?.trim(),
      city: formDetails?.city?.trim(),
      pincode: formDetails?.pincode?.trim()
    };
  
    let isValid = true;
    const errorDetails = { ...errors };
    console.log(trimmedDetails.name, !trimmedDetails.name)
    if (!trimmedDetails.name) {
      errorDetails.name = "Full name is required!";
      isValid = false;
    } else {
      errorDetails.name = undefined;
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

    setErrors(errorDetails)
  
    
     
    console.log("from chcek form",isValid)
    return { isValid, trimmedDetails };
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoaderOn(true);
  
    const { isValid, trimmedDetails } = await checkForm();
    console.log(isValid)
    if (isValid) {
      setFormDetails(trimmedDetails);
      await axios.post(`${API_URL}/api/updateCustomer`, { customer: trimmedDetails })
        .then(result => {
          setFormDetails({});
          setSelectedUser({});
          
          setIsEdit(false);
          console.log("Updated successfully");
        })
        .catch(err => console.log("Error occurred!", err))
        .finally(()=>setIsSubmitLoaderOn(false))
    } else {
      console.log("Form validation failed");
      setIsSubmitLoaderOn(false)

    }
  };
  
  
  const handleChange = (e) => {
   
    let { name, value } = e.target;

    setFormDetails({
      ...formDetails,
      [name]: value,
    });
    if (
      ["name", "mobileno", "address", "city", "pincode"].includes(
        name
      ) &&
      value.length !== 0
    ) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  //gender change

  useEffect(() => {

    if (selectedUser) {
      setFormDetails({...selectedUser})
      setErrors({})
      setGender(selectedUser.gender||genders[0]);
      setUserId(selectedUser.id)

    }


  }, [selectedUser])

  //handle user select 


  //handle remove
  const handleRemove = () => {

    setIsRemoveLoaderOn(true);
    if(userId)
    {
    axios.post(`${API_URL}/api/removeCustomer`, { id: userId })
      .then(result => {
        console.log("user removed")
        setFormDetails({})
        setSelectedUser("")
        setSureRemove(false)
        alert("user removed!")


      })
      .catch(err => console.log(err))
      .finally(()=>setIsRemoveLoaderOn(false))
    }
    else
    {
      console.log("no user found!")
      setIsRemoveLoaderOn(false)
    }
  }

  return (
    <div className="flex justify-between my-[5%]  min-w-full bg-gray-100  min-h-full">
      {userfound && (
        <div className="shadow-xl bg-white w-[30%] absolute z-20 mx-[34%] flex  flex-col items-center p-3 rounded-box my-[10%] ">
          <div className="text-lg text-[1.5rem] p-2">Already Have This Email!</div>
          <div>{errors?.userFound}</div>
          <div>
            <button
              onClick={() => setUserfound(false)}
              className="btn btn-warning bg-yellow-500  "
            >
              ok
            </button>
          </div>
        </div>
      )}
      {sureRemove && (
        <div className="shadow-xl bg-gray-100 w-[30%] absolute z-20 mx-[34%] flex  flex-col items-center p-3 rounded-box my-[10%] ">
          <div className="text-xl font-bold text-[1.5rem] p-2">Are You Sure!</div>
          <div className="text-center text-[1rem] p-2">you want to remove user {formDetails.name.toLocaleUpperCase()}! with the ID of <span className="text-lg">{userId}</span>  !</div>
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
            {isRemoveLoaderOn?<div className="loading loading-spinner"></div>:<span>Ok</span>}
              
            </button>
          </div>
        </div>
      )}
      <div className=" mt-10 ml-10 ">
        <button onClick={() => setIsEdit(false)} className="btn btn-error text-white">
          {" "}
          Back{" "}
        </button>
      </div>

      <div className=" flex justify-center mt-10">
        <div className="w-[100%]  max-w-[100%] ">

          <div className="glass bg-white  p-5 rounded-[1rem]">
          <div className="flex justify-between">
            <div className="flex justify-center w-[70%] z-20">
                      <span className="w-[70%]">Search Customer:</span>
                      <Search data={customerList} selectedItem={selectedUser} setSelectedItem={setSelectedUser} searchAttribute={'name'} />
                      </div>
                      <div>
                        <span className="p-2">{edit?"Edit Mode":"View Mode"}</span>
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
                      className={`appearance-none block w-full bg-gray-200 border ${errors.name ? "border-red-500" : ""
                        } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                      id="grid-first-name"
                      type="text"
                      value={formDetails?.name||""}
                      placeholder="Jane"
                      name="name"
                      onChange={handleChange}
                      disabled={!edit}
                    />
                   
                    {errors.name && (
                      <p className=" absolute text-red-500 text-xs italic">
                        {errors.name}
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
                  <input type="checkbox"  className="toggle" checked={edit} onChange={() => { setEdit(!edit)}} />


                </div>
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
                    value={formDetails?.gstnumber||""}
                    onChange={handleChange}
                    disabled={!edit}

                  />

                  {/* {errors.email && (
                    <p className="absolute text-red-500 text-xs italic">
                      {errors.email}
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
                    className={`appearance-none block w-full bg-gray-200 border ${errors?.mobileno ? "border-red-500" : "border-gray-200"
                      } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                    id="grid-mobile"
                    type="tel"
                    value={formDetails?.mobileno||""}
                    name="mobileno"
                    title="Please enter exactly 10 digits"
                    maxLength={10}
                    onChange={handleChange}
                    placeholder="enter 10 digit  mobile no"
                    disabled={!edit}

                  />
                  {errors.mobileno && (
                    <p className="absolute text-red-500 text-xs italic">
                      {errors.mobileno}
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
                    className={`border max-h-20 min-h-14 p-1 ${errors.address ? "border-red-500" : "border-gray-200"
                      }`}
                    id="address"
                    name="address"
                    rows={"2"}
                    value={formDetails?.address||""}
                    onChange={handleChange}
                    disabled={!edit}

                  />
                  {errors.address && (
                    <p className="absolute text-red-500 text-xs italic">
                      {errors.address}
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
                    className={`appearance-none block w-full bg-gray-200 border ${errors.city ? "border-red-500" : "border-gray-200"
                      }rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                    id="grid-city"
                    type="text"
                    name="city"
                    value={formDetails?.city||""}
                    placeholder="madurai..."
                    onChange={handleChange}
                    disabled={!edit}

                  />
                  {errors.city && (
                    <p className="absolute text-red-500 text-xs italic">
                      {errors.city}
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
                      value={formDetails?.state||""}
                    >
                      <option>Tamil nadu</option>
                      <option>Kerala</option>
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
                    value={formDetails?.pincode||""}
                    disabled={!edit}

                  />
                  {errors.pincode && (
                    <p className=" absolute text-red-500 text-xs italic">
                      {errors.pincode}
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
                  disabled={errors.name}
                >
                  {isSubmitLoaderOn?<div className="loading loading-spinner"></div>:
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  }
                </button>

              </div>
            </form>
          </div>

        </div>
        <div>
          <button className="btn btn-error text-white" onClick={() => {
            setSureRemove(true)

          }} disabled={!selectedUser?.id}>Remove</button>
        </div>
      </div>
      <div></div>
    </div>
  );
};
export default EditCustomer;

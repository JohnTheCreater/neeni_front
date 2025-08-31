import { React, useEffect, useState } from "react";
// import DropdownL from "../Dashboard/DropdownL";
import { IoCloseSharp } from "react-icons/io5";
import Drop from "../../components/Drop";
import api from "../../api/api";
import MessageBoard from "../products/MessageBoard";

const AddCustomer = ({ isAdd, setIsAdd }) => {



  const genders = ["male", "female", "others"];

  const [gender, setGender] = useState(genders[0])
  const [isSubmitLoaderOn, setIsSubmitLoaderOn] = useState(false);

  const [formDetails, setFormDetails] = useState({
    name: "",
    gender,
    email: "",
    mobileno: "",
    address: "",
    city: "",
    state: "Tamil nadu",
    pincode: "",
  });

  const [error, setError] = useState({});
  const [messageBoard, setMessageBoard] = useState({ title: "", message: "", state: false });


  useEffect(() => {

    setFormDetails({ ...formDetails, gender: gender })

  }, [gender])

  const handleChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;


    if (
      ["name", "email", "mobileno", "address", "city", "pincode"].includes(
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


  const checkForm = () => {

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

  const handleSubmit = (e) => {

    e.preventDefault();
    setIsSubmitLoaderOn(true);
    
    const { isValid, trimmedDetails, errorDetails } = checkForm();
    if (!isValid) {
      setIsSubmitLoaderOn(false)
      setError(errorDetails)
      return;
    }


    api.post('/api/customer/', { customer: trimmedDetails })
      .then(res => {
        console.log("Customer Added!")
       setIsAdd(false);
      }
      )
      .catch(err => {
        setMessageBoard({ title: "Error!", message: err.response.data.message, state: true })
       
      }
      )
      .finally(()=> setIsSubmitLoaderOn(false))


  }


  const handleBack = () => {
    setIsAdd(false);
  };




  return (
    <div className=" absolute top-[25%] md:top-[15%] md:left-[25%] md:w-[50%]  z-20">
      <div className="flex w-full">
        
       
        <div className="glass bg-white flex justify-center p-5 rounded-[1rem]">
          <form
            className="w-full  flex flex-col items-center "
            onSubmit={handleSubmit}
          >
             {messageBoard.state && 
             <div className="absolute z-30 top-[30%]">
             <MessageBoard setMessageBoard={setMessageBoard} messageBoard={messageBoard}/>
             </div>
             }
            <div className="flex gap-4 flex-wrap -mx-3 mb-6">

              <div className="flex w-full">
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
                    value={formDetails.name}
                    placeholder="Jane"
                    name="name"
                    onChange={handleChange}
                  />
                  {error.name && (
                    <p className=" absolute text-red-500 text-xs italic">
                      {error.name}
                    </p>
                  )}
                </div>
                <div className="w-full  md:w-1/2  px-3">
                  <label
                    className="block uppercase tracking-wide text-xs font-bold mb-2"
                    for="grid-gender"
                  >
                    Gender
                  </label>
                  <Drop option={gender} setOption={setGender} list={genders} />
                </div>
                <div className="flex justify-end items-center w-full  md:w-1/2  px-3">
                  <button
                    type="button"
                    className="btn btn-error text-white  p-1 rounded-[0.3rem]"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                </div>
              </div>

              <div className="w-full md: px-3">
                <label
                  className="block uppercase tracking-wide text-xs font-bold mb-2"
                  for="grid-email"
                >
                  Email
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 border ${error.email ? "border-red-500" : "border-gray-200"
                    } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="grid-email"
                  type="email"
                  placeholder="enter email"
                  name="email"
                  value={formDetails.email}
                  onChange={handleChange}
                />

                {error.email && (
                  <p className="absolute text-red-500 text-xs italic">
                    {error.email}
                  </p>
                )}
              </div>
              <div className="w-full md: px-3">
                <label
                  className="block uppercase tracking-wide text-xs font-bold mb-2"
                  for="grid-email"
                >
                  GST number:
                </label>
                <input
                  className={`appearance-none block w-full bg-gray-200 border ${"border-gray-200"
                    } rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="grid-gst"
                  type="text"
                  placeholder="enter gst number"
                  name="gst"
                  value={formDetails.gst}
                  onChange={handleChange}
                />

                {error.email && (
                  <p className="absolute text-red-500 text-xs italic">
                    {error.email}
                  </p>
                )}
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
                  className={`appearance-none block w-full bg-gray-200 border ${error.mobileno ? "border-red-500" : "border-gray-200"
                    } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="grid-mobile"
                  type="tel"
                  value={formDetails.mobileno}
                  name="mobileno"
                  title="Please enter exactly 10 digits"
                  maxLength={10}
                  onChange={handleChange}
                  placeholder="enter 10 digit  mobile no"
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
                  value={formDetails.address}
                  onChange={handleChange}
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
                  value={formDetails.city}
                  placeholder="madurai..."
                  onChange={handleChange}
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
                    className="block appearance-none w-full bg-gray-200 text-black border border-gray-200 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                    onChange={handleChange}
                    name="state"
                    value={formDetails.state}
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
                  value={formDetails.pincode}
                />
                {error.pincode && (
                  <p className=" absolute text-red-500 text-xs italic">
                    {error.pincode}
                  </p>
                )}
              </div>
            </div>
            <div>
              <button
                className="bg-green-500 text-white p-2  rounded-[0.3rem]"
                type="submit"
                disabled={error.name}
              >
                {isSubmitLoaderOn ? <div className="loading loading-spinner"></div> :
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

    </div>

  );
};

export default AddCustomer;

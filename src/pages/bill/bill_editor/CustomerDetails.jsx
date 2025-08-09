import React from 'react'
import Search from "../../../components/Search";

const CustomerDetails=({customerList=[],setCustomer,customer})=>{

  

    return(
      <>
       
    {/* customer */}
    <div className="items-center  justify-between md:w-[80%]  w-full p-1">
      <div className="flex justify-center items-center text-xl font-medium">
        Customer's Info
      </div>
      <div className="flex flex-col items-center md:flex-row justify-between m-5 ">
        <div className='flex  justify-center w-1/2 items-center gap-2'>
        <lable className="font-medium ">Name:</lable>
        <Search
        key={customer?.id||'default'}
          data={customerList}
          selectedItem={customer}
          setSelectedItem={setCustomer}
          suggLength={'20%'}
          searchAttribute={"name"}
        />
        </div>
        <div className="flex gap-2  md:w-[50%] m-1">
          <label className="font-medium">Address:</label>
          <textarea
            className="p-1 max-h-[20vh] border w-full"
            name="address"
            value={customer?.address || ""}
            key={customer?.address || "empty-address"}
  
            disabled
          ></textarea>
        </div>
      </div>
  
      <div className="flex flex-col md:flex-row  justify-between m-5 ">
        <div className="flex w-1/2 items-center gap-2">
          <label className="font-medium">Mobile Number:</label>
          <input
            className="p-1 border  "
            name="mobile_no"
            value={customer?.mobileno || ""}
            disabled
            key={customer?.mobileno || "empty-mobileno"}
  
          ></input>
        </div>
        <div className="flex w-1/2 items-center gap-2">
          <label className="font-medium">customer Id:</label>
          <input
            className="p-1 border  "
            name="mobile_no"
            value={customer?.id || ""}
            disabled
            key={customer?.id || "empty-id"}
  
          ></input>
        </div>
      </div>
    </div></>
    )
  }
  

export default CustomerDetails
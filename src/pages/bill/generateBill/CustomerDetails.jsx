import React from 'react'
import Search from "../../../components/Search";

const CustomerDetails=({userList=[],setUser,user})=>{

    return(
      <>
       
    {/* user */}
    <div className="items-center  justify-between md:w-[80%]  w-full p-1">
      <div className="flex justify-center items-center text-xl font-medium">
        Customer's Info
      </div>
      <div className="flex flex-col items-center md:flex-row justify-between m-5 ">
        <div className='flex  justify-center w-1/2 items-center gap-2'>
        <lable className="font-medium ">Name:</lable>
        <Search
        key={user?.id||'default'}
          data={userList}
          selectedItem={user}
          setSelectedItem={setUser}
          suggLength={'20%'}
          searchAttribute={"name"}
        />
        </div>
        <div className="flex gap-2  md:w-[50%] m-1">
          <label className="font-medium">Address:</label>
          <textarea
            className="p-1 max-h-[20vh] border w-full"
            name="address"
            value={user?.address || ""}
            key={user?.address || "empty-address"}
  
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
            value={user?.mobileno || ""}
            disabled
            key={user?.mobileno || "empty-mobileno"}
  
          ></input>
        </div>
        <div className="flex w-1/2 items-center gap-2">
          <label className="font-medium">User Id:</label>
          <input
            className="p-1 border  "
            name="mobile_no"
            value={user?.id || ""}
            disabled
            key={user?.id || "empty-id"}
  
          ></input>
        </div>
      </div>
    </div></>
    )
  }
  

export default CustomerDetails
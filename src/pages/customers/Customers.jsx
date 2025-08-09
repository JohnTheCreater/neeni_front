
import React,{useEffect, useState } from "react";
import axios from "axios";
import LayOut from "../../components/LayOut/LayOut";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import { API_URL } from "../../config";
import { IoClose } from "react-icons/io5";
import SuggSearch from "../../components/SuggSearch";
import BillList from "./BillList";
import api from "../../api/api";
export default function Customers() {
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [list, setList] = useState([]);
  const [isBillListOpen,setIsBillListOpen] = useState(false);
  const [selectedCustomer,setSelectedCustomer] = useState({});

  const [suggestion, setSuggestion] = useState([]);


  const get_list = async() => {
    api
      .get(`/api/customer/active`)
      .then((res) => {
        const data = res.data;
        console.log(res);
        setList(data || []);
        setSuggestion(data|| []);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  useEffect(() => {
    get_list();
  }, [isAdd,isEdit]);

  const handleCustomerClick = async(customer,index)=>{

    if(!isBillListOpen)
    {
      setSelectedCustomer(customer);
      setIsBillListOpen(true);
    }

 
  }

  return (
    <>
      {isEdit && (
        <div className="absolute z-40 w-full h-full">
          <EditCustomer setIsEdit={setIsEdit} />
        </div>
      )}
      {isAdd && <AddCustomer isAdd={isAdd} setIsAdd={setIsAdd} />}

      <LayOut>
        <div>
          
        
  {isBillListOpen &&
  <div className="absolute  z-10 w-[100%] h-[100%]  bg-gray-100/30 backdrop-blur-md shadow-lg rounded-lg border border-gray-200">
  <div className="relative p-10 w-[50%] left-[25%]"> 
    <div className="flex justify-between m-4">
      <div></div>
  <button onClick={()=>setIsBillListOpen(false)}  className="bg-red-500 p-2 text-white rounded-lg ">close</button>
</div>
    <BillList customer={selectedCustomer} customerList={list} /> 
    </div>
    </div>}

      
        <div className="h-full w-full items-center  p-2">
          <SuggSearch searchAttribute={"name"} data={list}  setSuggestion={setSuggestion} />


          <div className=" m-10 border bg-white  rounded-[1rem] overflow-auto min-h-[60vh] max-h-[60vh]">

      
            <table className="w-[100%] bg-white border-1 shadow-xl   rounded-[1rem] ">
              <thead className="sticky top-0 bg-white border-1 z-4">
                <tr className="border border-2 border-gray-100  sticky top-0 bg-neutral text-neutral-content">
                  <th>customer id</th>

                  <th className="min-w-[10vw]  p-3">Name</th>
                  <th>Address</th>
                  <th>Mobile no</th>
                  <th>Email</th>
                  <th>Zip</th>
                  <th>Total Purchase</th>
                  <th>Remaining Payment</th>
                </tr>
              </thead>
              <tbody className="  ">
              {suggestion.map((customer, index) => (
            <React.Fragment key={customer.id}>
              <tr className="border border-2 border-gray-100" onClick={() => handleCustomerClick(customer, index)}>
                <td className="text-center p-2">{customer.id}</td>
                <td className="text-center p-2">{customer.name}</td>
                <td className="text-center p-2">{customer.address}</td>
                <td className="text-center p-2">{customer.mobileno}</td>
                <td className="text-center p-2">{customer.email}</td>
                <td className="text-center p-2">{customer.pincode}</td>
                <td className="text-center p-2">{customer.bill_amount}</td>
                <td className="text-center p-2">{customer.unpaid}</td>
              </tr>
             
            </React.Fragment>
          ))}
              </tbody>
            </table>
           
          </div>
          <div className="flex justify-center">
            <div className="flex justify-between items-center w-[80%]">
              <button
                className="btn btn-neutral"
                onClick={() => setIsEdit(true)}
              >
                edit customer
              </button>
              <button
                onClick={() => {
                  setIsAdd(true);
                }}
                type="button"
                className="btn btn-neutral "
              >
                Add customer
              </button>
            </div>
          </div>
        </div>
        </div>
      </LayOut>
    </>
  );
}

const InfoBoard = ({paymentInfo,setInfoState})=>{
  return(
    <div className="bg-white flex flex-col">
      <div className="flex justify-between m-3">
      <span className="bg-neutral text-white rounded-full w-10 h-10 flex items-center justify-center">
  <span>{paymentInfo.id}</span>
</span>      
<button className="bg-error text-white hover:bg-red-700 p-3 rounded-3xl flex justify-center items-center" onClick={()=>setInfoState(false)}><IoClose/></button>

</div>
<span>
      <lable>Name: </lable>
      <span className="font-medium m-2">{paymentInfo.name}</span>
      </span>
      <span>
      <lable>Total Amount :</lable>
      <span className="font-medium m-2">{parseFloat(paymentInfo.totalAmount).toFixed(2)}</span>
      </span>
      <span>
      <lable>Remaining Amount :</lable>
      <span className="font-medium m-2">{parseFloat(paymentInfo.remainingAmount).toFixed(2)}</span>
      </span>
    </div>
  )
}
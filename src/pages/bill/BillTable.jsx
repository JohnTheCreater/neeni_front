import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { IoMdCloudDownload } from "react-icons/io";
import dayjs from "dayjs";
import { GoBellFill } from "react-icons/go";
import { NavLink } from "react-router-dom";
import axios from "axios";
import api from "../../api/api";


const BillTable = ({bills,customerList,shopList})=>
{
    const [isDownloadLoaderOn, setIsDownloadLoaderOn] = useState(false)
      const [isSendMailLoaderOn, setIsSendMailLoaderOn] = useState(false)
      const [isNotifyLoaderOn, setIsNotifyLoaderOn] = useState(false);

    const downloadBill = (item) => {
        setIsDownloadLoaderOn(true)
        api
          .get(
            `/api/bill/download/${item.id}`,
            { responseType: "arraybuffer" }
          )
          .then((response) => {
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
    
            console.log("Blob URL: ", url);
    
            const link = document.createElement("a");
            link.href = url;
    
            const customer = customerList.find((customer) => customer.id === item.customer_id);
            link.download = `${customer.name}_${item.id}.pdf`; 
    
            document.body.appendChild(link);
    
            
            link.click();
    
            
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
    
            
          })
          .catch((err) => console.error("Error loading PDF in iframe: ", err))
          .finally(() => setIsDownloadLoaderOn(false))
      };
    
      const sendBill = (item) => {
        setIsSendMailLoaderOn(true)
        api
          .post(`/api/bill/send`, { billNumber: item.id })
          .then((res) => console.log(res))
          .catch((err) => console.log(err))
          .finally(() => setIsSendMailLoaderOn(false))
      };
    
      const handleNotify=(item)=>{
        setIsNotifyLoaderOn(true)
        api.post(`/api/bill/notifyCustomer`,{billNumber:item.id})
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
        .finally(()=>setIsNotifyLoaderOn(false))
      }
    return (
        <div className="overflow-auto h-[80%] w-full">
        <table className="table table-fixed table-pin-rows	 bg-white">
          <thead>
            <tr className="">
              <th>Bill no</th>
              <th>Customer Name</th>
              <th>Shop</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="">
            {bills.map((item, index) => {
              console.log(customerList);
              let customer = (customerList &&
                customerList.find((it) => it.id === item.customer_id)) || {
                name: "unknown",
              };
              let shop = (shopList &&
                shopList.find((shli) => shli.id === item.shopid)) || {
                shopname: "unknown",
              };
              return (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{customer.name}</td>
                  <td>{shop.name}</td>
                  <td>{dayjs(item.date).format("DD-MM-YYYY")}</td>
                  <td>
                    <div className="flex justify-between">
                      <NavLink
                        to={"/bill/editor"}
                        state={{
                          customerList,
                          shopList,
                          mode: "edit",
                          customer: customer,
                          shop: shop,
                          billNumber: item.id,
                          date: item.date,
                          paid_amount: item.paid_amount
                        }}
                      >
                        <button className="p-2 rounded-lg bg-red-500 text-white">
                          Edit
                        </button>
                      </NavLink>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="p-2 rounded-lg bg-gray-200"
                        >
                          <BsThreeDots />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-15 p-2 shadow"
                        >
                          <li>
                            <button
                              onClick={() => sendBill(item)}
                              key={index}
                            >
                              {isSendMailLoaderOn ? (
                                <div className="loading loading-spinner"></div>
                              ) : (
                                <span>

                                  <IoSend />{" "}
                                </span>
                              )}
                            </button>
                          </li>
                          <li>
                            <button onClick={() => downloadBill(item)}>

                              {isDownloadLoaderOn ? (
                                <div className="loading loading-spinner"></div>
                              ) : (
                                <span>

                                  <IoMdCloudDownload />
                                </span>
                              )}
                            </button>
                          </li>
                          
                            <li>
                              {
                                <button onClick={()=>handleNotify(item)}>
                                  {
                                isNotifyLoaderOn ? <div className="loading loading-spinner"></div>
                                  : <GoBellFill />

                                  }     
                                  </button>
                              }
                            </li>
                          
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )
}

export default BillTable;
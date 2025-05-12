import React, { useEffect, useState } from "react";
import LayOut from "../../components/LayOut/LayOut";
import axios from "axios";
import { API_URL } from "../../config";
import { NavLink } from "react-router-dom";

import BillTable from "./BillTable";

import Drop from '../../components/Drop'

const Bill = () => {
  const [bills, setBills] = useState([]);
  const [userList, setUserList] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [shop, setShop] = useState(shopList[0]);
  const [month, setMonth] = useState(new Date().toLocaleString('en', { month: 'short' }));
  const [year, setYear] = useState(new Date().getFullYear());
  const [filteredBills, setFilteredBills] = useState([]);
  
  const [paid,setPaid] = useState(0.00);
  const [unPaid,setUnPaid] = useState(0.00);
  const startYear = 2022;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString('en', { month: 'short' })
  );

  useEffect(() => {
    axios
      .post(`${API_URL}/api/get`, { tableName: "bills" })
      .then((res) => setBills(res.data))
      .catch((err) => console.log(err));

    axios
      .post(`${API_URL}/api/get`, { tableName: "user" })
      .then((res) => setUserList(res.data))
      .catch((err) => console.log(err));

    axios
      .post(`${API_URL}/api/get`, { tableName: "shops" })
      .then((res) => setShopList(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log("sh", shopList);
    setShop(shopList.map(list => list.name)[0]);
  }, [shopList]);

  useEffect(() => {
    const shopId = shopList.find(sh => sh.name === shop)?.id;
    const monthIndex = monthNames.indexOf(month);

    const filteredList = bills.filter(bill => bill.shopid === shopId && new Date(bill.date).getMonth() === monthIndex && new Date(bill.date).getFullYear() === year);
    setFilteredBills(filteredList);

    const date =  new Date(year,monthIndex,1)
    const dateISO = date.toISOString();
    console.log(dateISO , monthIndex , date.getMonth())
    axios.post(`${API_URL}/api/getPaymentInfo`,{dateISO:dateISO})
    .then(res=>{
      const{paid,unpaid}=res.data
      // console.log("paid unpaid : ",typeof(paid),typeof(unPaid))
      setPaid(paid);
      setUnPaid(unpaid);
    })

  }, [shop, month, year, bills, shopList]);

 

  return (
    <LayOut>
      <div className="flex h-[100vh] justify-center">
        <div className="mt-10 flex flex-col h-[80%] items-center w-[70%]">
          <div className="flex justify-between w-full">
            <div className="flex  justify-between items-center">
              <lable className="m-2 text-lg font-bold">Paid:</lable>
            <input disabled className="p-2 border border-green-300 rounded-lg bg-green-200 font-bold text-center" value={paid}/>

            <lable className="m-2 text-lg font-bold">UnPaid:</lable>
            <input disabled className="p-2 border border-red-300 rounded-lg bg-red-200  font-bold text-center" value={unPaid}/>
            </div>
            <div>
            <Drop option={shop} setOption={setShop} list={shopList.map(item => item.name)} />
            <Drop option={month} setOption={setMonth} list={monthNames} />
            <Drop option={year} setOption={setYear} list={years} />
            </div>
          </div>
         <BillTable bills={filteredBills} userList={userList} shopList={shopList}/>
        </div>
        <NavLink to="/bill/generateBill" state={{ userList, shopList, date: new Date(), mode: "add" }}>
          <button className="btn btn-neutral m-5 text-white">
            Generate Bill
          </button>
        </NavLink>
      </div>
    </LayOut>
  );
};

export default Bill;
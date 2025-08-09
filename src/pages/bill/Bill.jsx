import React, { useEffect, useState } from "react";
import LayOut from "../../components/LayOut/LayOut";
import { NavLink } from "react-router-dom";

import BillTable from "./BillTable";

import Drop from '../../components/Drop'
import api from "../../api/api";

const Bill = () => {
  const [bills, setBills] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [shop, setShop] = useState(sessionStorage.getItem("shop") || shopList[0]?.name);
  const [month, setMonth] = useState(sessionStorage.getItem("month") || new Date().toLocaleString('en', { month: 'short' }));
  const [year, setYear] = useState(Number(sessionStorage.getItem("year")) || new Date().getFullYear());
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
    api
      .get(`/api/bill`)
      .then((res) =>{

        console.log(res)
        setBills(res.data)
      } )
      .catch((err) => console.log('error:',err));

    api
      .get(`/api/customer`)
      .then((res) => setCustomerList(res.data))
      .catch((err) => console.log(err));

    api
      .get(`/api/core/shops`)
      .then((res) => setShopList(res.data))
      .catch((err) => console.log(err));
  }, []);


  useEffect(() => {
  
    
    if(sessionStorage.getItem("shop")!= "undefined")
      setShop(sessionStorage.getItem("shop"));
    else
      setShop(shopList.map(list => list.name)[0]);

  }, [shopList]);

  useEffect(() => {
    const shopId = shopList.find(sh => sh.name === shop)?.id;
    const monthIndex = monthNames.indexOf(month);

    

    const filteredList = bills.filter(bill => bill.shopid === shopId &&
       new Date(bill.date).getMonth() === monthIndex &&
        new Date(bill.date).getFullYear() === year);
        console.log(year)
    setFilteredBills(filteredList);

    const date = new Date(year, monthIndex, 1).toISOString()
    api.get(`/api/bill/paymentInfo/${date}`)
    .then(res=>{
      const{paid,unpaid} = res.data
      setPaid(paid);
      setUnPaid(unpaid);
    })

  }, [shop, month, year, bills, shopList]);

  useEffect(()=>{

    sessionStorage.setItem("month",month);
    sessionStorage.setItem("year",year);
    sessionStorage.setItem("shop",shop);
    console.log(shop +" "+typeof(shop));
    console.log(year +" "+typeof(year));
    console.log(month +" "+typeof(month));
    
   


  },[month,year,shop])

 

  return (
    <LayOut>
      <div className="flex h-[100vh] justify-center">
        <div className="mt-10 flex flex-col h-[80%] items-center w-[80%]">
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
         <BillTable bills={filteredBills} customerList={customerList} shopList={shopList}/>
        </div>

        <div className="relative">
        <NavLink className={''}  to="/bill/editor" state={{ customerList, shopList, date: new Date(), mode: "add" }}>
          <button className="btn w-full btn-neutral m-5 text-white">
            Generate Bill
          </button>
        </NavLink>
        </div>
        
      </div>
    </LayOut>
  );
};

export default Bill;
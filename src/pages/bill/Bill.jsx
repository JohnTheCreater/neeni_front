import React, { useEffect, useState } from "react";
import LayOut from "../../components/LayOut/LayOut";
import { NavLink } from "react-router-dom";

import BillTable from "./BillTable";

import Drop from '../../components/Drop'
import api from "../../api/api";
import SuggSearch from "../../components/SuggSearch";
import PaginationNav from "../../components/PaginationNav";
import LoadingLayout from "../../components/LoadingLayout";

const Bill = () => {

  const [shopList, setShopList] = useState([]);
  const [shop, setShop] = useState(sessionStorage.getItem("shop") || shopList[0]?.name);
  const [month, setMonth] = useState(sessionStorage.getItem("month") || new Date().toLocaleString('en', { month: 'short' }));
  const [year, setYear] = useState(Number(sessionStorage.getItem("year")) || new Date().getFullYear());
  const [filteredBills, setFilteredBills] = useState([]);
  const [filterOption,setFilterOption] = useState("Drop");
  const [searchValue,setSearchValue] = useState("");
  const [page,setPage] = useState(1);
  const [pageCount,setPageCount] = useState(0);
  const [limit,setLimit] = useState(5);
  
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

   getData()

  }, [shop, month, year,shopList,filterOption,page,searchValue]);


  useEffect(()=>{
      setPage(1);
  },[filterOption,shop,month,year,searchValue])

  
  const getData = () => {

     if(filterOption === "Drop")
    {
       
        retriveRangeResult();

    }
    else
    {
       
        setPaid(0.00);
        setUnPaid(0.00);
        retriveSearchResult();
    }

  }

  const retriveRangeResult = ()=>{

    const shopId = shopList.find(sh => sh.name === shop)?.id;
    const monthIndex = monthNames.indexOf(month);
    if(!shopId) return;

    api.get(`/api/bill/active/${monthIndex}/${year}/${shopId}?limit=${limit}&page=${page}`)
    .then(res=>{
      const {paid,unpaid,pages,result} = res.data;
      setPaid(paid);
      setUnPaid(unpaid);
      setPageCount(pages)
      setFilteredBills(result);
    
    })
    .catch(err => console.err(err))

  }

  const retriveSearchResult = ()=>{


    api.get(`/api/bill/active/search?limit=${limit}&page=${page}&value=${searchValue}`)
    .then(res=>{
      const{pages,result} = res.data;
     
      setFilteredBills(result);
      setPageCount(pages);
    
    })
    .catch(err=>console.err(err))



  }

  

  useEffect(()=>{

    sessionStorage.setItem("month",month);
    sessionStorage.setItem("year",year);
    sessionStorage.setItem("shop",shop);
    console.log(shop +" "+typeof(shop));
    console.log(year +" "+typeof(year));
    console.log(month +" "+typeof(month));
    
   


  },[month,year,shop])

  if(shopList.length === 0 )
  {
    return <LoadingLayout/>
  }

 

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
            <div className="flex">
              <div>
                <Drop option={filterOption} setOption={setFilterOption} list={["Drop","Search"]} />
              </div>
              {filterOption === "Drop" ?
              <div>
               <Drop option={shop} setOption={setShop} list={shopList.map(item => item.name)} />
            <Drop option={month} setOption={setMonth} list={monthNames} />
            <Drop option={year} setOption={setYear} list={years} /></div>
            :<div><SuggSearch onChange={(value) => setSearchValue(value)} /></div>
              }
           
            </div>
          </div>
         <BillTable bills={filteredBills} />
         {pageCount > 0 && <PaginationNav key={pageCount} page={page} setPage={setPage} pageCount={pageCount}/>}
        </div>

        <div className="relative">
        <NavLink className={''}  to="/bill/editor" state={{   mode: "add" }}>
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
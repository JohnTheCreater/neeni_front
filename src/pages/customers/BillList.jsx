import { useEffect, useState } from "react";
import api from "../../api/api";
import BillTable from "../bill/BillTable";
import PaginationNav from "../../components/PaginationNav";

const BillList = ({customer={}})=>
{


    const[bills,setBills] = useState([]);
    const [page,setPage] = useState(1);
    const [pageCount , setPageCount] = useState(0);
    const [limit,setLimit] = useState(5);

    useEffect(()=>{

       api.get(`/api/bill/customer/${customer.id}?page=${page}&limit=${limit}`)
        .then(res => {
          setBills(res.data.result)
          setPageCount(res.data.pageCount);
        }
        )
        .catch(err => console.log(err))
        
    },[page])

 
       

      

  return (
      <div className=" mt-10 flex flex-col h-[80%] items-center w-[100%]">
      <BillTable bills={bills}  />
      {pageCount > 0 && <PaginationNav page={page} setPage={setPage} pageCount={pageCount}/>}
    </div>
  )
}

export default BillList;

import  { useEffect, useState } from "react";
import LayOut from "../../components/LayOut/LayOut";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import { IoClose } from "react-icons/io5";
import SuggSearch from "../../components/SuggSearch";
import BillList from "./BillList";
import api from "../../api/api";
import PaginationNav from "../../components/PaginationNav";
import CustomerTable from "./CustomerTable";
import LoadingLayout from "../../components/LoadingLayout";
export default function Customers() {

  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isBillListOpen, setIsBillListOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [searchValue,setSearchValue] = useState("");
  const [suggestion, setSuggestion] = useState([]);

  const limit = 8;


 
  const getResult = () => {

    api
      .get(`/api/customer/active/search?value=${searchValue}&page=${page}&limit=${limit}`)
      .then((res) => {
        const data = res.data;
        console.log(res);
        setSuggestion(data.customerList || []);
        setPageCount(data.pageCount);

      })
      .catch((error) => {
        console.error("There was an error!", error);
      });


  }

  useEffect(() => {

    getResult();

  }, [isAdd, isEdit, page,searchValue]);

  useEffect(()=>{
      setPage(1);
  },[searchValue])



  const handleCustomerClick = async (customer, index) => {

    if (!isBillListOpen) {
      setSelectedCustomer(customer);
      setIsBillListOpen(true);
    }


  }

  if(suggestion.length == 0 && pageCount == 0 && searchValue === "")
  {
    return <LoadingLayout/>
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
              <div className="relative p-10 w-[60%] left-[20%]">
                <div className="flex justify-between m-4">
                  <div></div>
                  <button onClick={() => setIsBillListOpen(false)} className="bg-red-500 p-2 text-white rounded-lg ">close</button>
                </div>
                <BillList customer={selectedCustomer} />
              </div>
            </div>}


          <div className="h-full w-full items-center  p-2">
            <SuggSearch onChange={(value)=>setSearchValue(value)} />


            <div className=" m-3 border bg-white  rounded-[1rem] overflow-auto min-h-[60vh] max-h-[60vh]">

            <CustomerTable suggestion={suggestion} handleCustomerClick={handleCustomerClick} />

            </div>
            {pageCount > 0 &&
              <div className="flex justify-center items-center mb-10">
                <PaginationNav key={pageCount} page={page} setPage={setPage} pageCount={pageCount} /></div>}


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

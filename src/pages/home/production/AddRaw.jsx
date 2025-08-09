import  { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { MdOutlineClose } from "react-icons/md";
import Drop from "../../../components/Drop";
import dayjs from 'dayjs'
import api from "../../../api/api";


const AddRaw = ({ setIsAddRaw, productionProducts, coreProducts, setIsError}) => {

  const [selectedCoreProduct, setSelectedCoreProduct] = useState(coreProducts[0]);
  const [selectedProductionProduct, setSelectedProductionProduct] = useState(productionProducts[0]);
  const [date, setDate] = useState(new Date());

  const [rawData, setRawData] = useState({ cpid: selectedCoreProduct.id, ppid:selectedProductionProduct.id , quantity: 0, date: date });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isSubmitLoaderOn,setIsSubmitLoaderOn]=useState(false)

  useEffect(() => {
    setRawData({ ...rawData, cpid: selectedCoreProduct.id })
  }, [selectedCoreProduct])

  useEffect(() => {
    setRawData({ ...rawData, ppid: selectedProductionProduct.id })
  }, [selectedProductionProduct])

  useEffect(() => {
    setRawData({ ...rawData, date: date })
  }, [date])

  const handleChange = (e) => {
    const value = e.target.value;
    if (value !== 0) setRawData({ ...rawData, quantity: value });
    else e.target.value = "";
  };
  useEffect(() => {
    if (selectedProductionProduct.id === 4) {
      setSelectedCoreProduct(coreProducts[0])
    }
   

  }, [selectedCoreProduct, selectedProductionProduct])

  useEffect(() => {
    setIsCalendarOpen(false)

  }, [date])

  const handleProductionAddition =  () => {

    setIsSubmitLoaderOn(true)
    if (rawData.quantity) {
     api
        .post(`/api/production/addRaw`, {
          rawData: rawData,
        })
        .then((result) => {
          setIsAddRaw(false);
          
        })
        .catch(err=>setIsError({message:err.response.data.message,value:true}))
        .finally(()=>setIsSubmitLoaderOn(false))
    } else {
      setIsError({
        message: "you have no value! please enter a value!",
        value: true,
      });
      setIsSubmitLoaderOn(false)
    }
   
  };

  return (
    <div className="min-w-[20rem] rounded-[.4rem] border border-gray-600 p-4 min-h-[10rem] bg-white">
      { }
      <div className="md:flex justify-between max-w-[95%]">
        <Drop  list={productionProducts} option={selectedProductionProduct}  setOption={setSelectedProductionProduct} attribute={'name'}  />
        <Drop list={ selectedProductionProduct.id == 4 ?[coreProducts[0]] : coreProducts} option={selectedCoreProduct} setOption={setSelectedCoreProduct} attribute={'name'}/>
        <button className="btn m-1" onClick={() => setIsCalendarOpen(true)}>{dayjs(date).format("DD-MM-YYYY")}</button>
        { isCalendarOpen && <div className="absolute">
         
        <Calendar onChange={setDate} value={date} />
        </div>}


        <div className="flex items-center">
       
          <input
            type="number"
            className="max-w-36 m-2 p-1 border border-gray-200 rounded-[.2rem]"
            placeholder="enter value..."
            onChange={handleChange}
          ></input>
          {selectedProductionProduct.id === 1 ? <span className="font-bold">LTR</span> : <span className="font-bold">KG</span>}

        </div>
      </div>
      <div className="max-w-[80%] flex justify-between items-center mt-10">
        <button
          className="btn bg-red-500 text-white hover:bg-red-600"
          onClick={() => setIsAddRaw(false)}
        >
          <MdOutlineClose />
        </button>
        <button className="btn btn-success text-white" onClick={handleProductionAddition}>
          {isSubmitLoaderOn?<div className="loading loading-spinner"></div>:<span>Submit</span>}
        </button>
      </div>
    </div>
  );
};

export default AddRaw;


import { useState,useEffect } from "react";
import Calendar from "react-calendar";
import Drop from "../../../components/Drop";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";



const UnPackedForm =({coreProducts,outputs,setIsUnpackedForm,handleUnPackedFormSubmit,isUnPackedFormLoaderOn})=>{
  
        const [selectedCoreProduct,setSelectedCoreProduct]=useState(coreProducts[0]);
        const [selectedOutput,setSelectedOutput]=useState(outputs[0]);
        const[value,setValue]=useState('');

        const [isCalendarOpen,setIsCalendarOpen] = useState(false);
        const [date,setDate] = useState(new Date()); 

        useEffect(() => {

        setIsCalendarOpen(false)
    
        }, [date])

  return(

        <div className="bg-white p-4 flex flex-col justify-center items-center rounded-xl">
        <div className="flex justify-between w-full">
        <Drop list={coreProducts} option={selectedCoreProduct} setOption={setSelectedCoreProduct} attribute={'name'}/>
        <Drop list={outputs} option={selectedOutput} setOption={setSelectedOutput} attribute={'name'}/>
        <button className="btn m-1" onClick={() => setIsCalendarOpen(true)}>{dayjs(date).format("DD-MM-YYYY")}</button>
      
            {
                isCalendarOpen && 
                <div className="absolute">    
                <Calendar onChange={setDate} value={date} />
                </div>
            }

        <div className="flex justify-center items-center">
        <button className="p-1 bg-error rounded-xl text-white " onClick={()=>setIsUnpackedForm(false)}><IoClose />      </button>
        </div>
        </div>

        <div>
            <lable className="font-medium">value:</lable>
            <input type="number" className="p-1 border m-2" onChange={(e)=>setValue(e.target.value)}></input>
        </div>

        <button className="btn btn-success text-white" onClick={()=>handleUnPackedFormSubmit(selectedCoreProduct.id,selectedOutput.id,value,date)}>{isUnPackedFormLoaderOn?<div className="loading loading-spinner"></div>:<span>Submit</span>}</button>
      </div>
  )
}


export default UnPackedForm;

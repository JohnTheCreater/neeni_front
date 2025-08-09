import Drop from "../../../components/Drop";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const PackedForm =({index,handlePackedFormSelect,coreVolumes,handlePackedFormSubmit,isPackedFormLoaderOn})=>{

  const [selectedCoreVolume,setSelectedCoreVolume]=useState(coreVolumes[0])
  const [value,setValue]=useState('')

  return(
    <div className="bg-white p-2 flex flex-col items-center">
      <div className="flex justify-between items-center">

      <Drop list={coreVolumes} option={selectedCoreVolume} setOption={setSelectedCoreVolume} attribute={'name'}/>

      <button className="p-1 bg-error rounded-xl text-white   " onClick={()=>handlePackedFormSelect(index)}><IoClose />      </button>
      </div>
      <div className="m-1 ">
        <label className="font-medium">value:</label>
      <input type="number" className="w-full border p-1" onChange={(e)=>setValue(e.target.value)}></input>

      </div>
      <div>
        <button className="btn btn-success text-white" onClick={()=>handlePackedFormSubmit(index+1,selectedCoreVolume.id,value)}>{isPackedFormLoaderOn?<div className="loading loading-spinner"></div>:<span>Submit</span>}</button>
      </div>
    </div>
  )
}


export default PackedForm;
import React, { useState } from 'react'
import Drop from "../../../components/Drop";
import Calendar from "react-calendar";


const Info=({billNumber,setDate,date,shop,setShop,shopList})=>{

    const [calToggle, setCalToggle] = useState(false);
    useState(()=>{
      console.log(billNumber,date,shop,shopList)
    },[])
  
    return(
      <div className="flex p-2 md:w-[80%] w-full justify-between">
      <div className="flex gap-2 items-center justify-center">
        <label className="font-medium">Bill Number:</label>
        <input
          value={billNumber}
          className="bg-green-200 w-20  border border-green-300 font-bold text-center"
          disabled
        ></input>
      </div>
  
      <div className="flex gap-2 items-center">
        <div className='flex items-center gap-2'>
        <label className="font-medium">Date:</label>
        <button
          type="button"
          onClick={() => setCalToggle((calToggle) => !calToggle)}
          className="btn "
        >
          {date.toLocaleDateString()}
          
        </button>
        {calToggle && (
          <div className="absolute z-10 b-10 top-48">
            <Calendar onChange={(value)=>{setDate(value)
                setCalToggle(false)
            }} value={date} />
          </div>
        )}
        </div>
        <div className="">
          <Drop option={shop} setOption={setShop} list={shopList} attribute={'name'}/>
        </div>
      </div>
    </div>
    )
  }
  

export default Info
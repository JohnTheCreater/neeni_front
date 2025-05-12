
import  React from 'react'

import { IoClose } from "react-icons/io5";
const  MessageBoard=({messageBoard,setMessageBoard})=>{

  return(
    <div className="min-w-[50%] bg-white p-2">
      <div className="flex justify-between">
        <div></div>
      <div className="font-bold text-xl">{messageBoard.title}</div>
      <div><button className="p-1 bg-red-500 text-white rounded-[100%]" onClick={()=>setMessageBoard({message:"",title:"",state:false})}><IoClose/></button></div>
      </div>
      <div className="p-3">{messageBoard.message}</div>
      
    </div>
  )

}

export default MessageBoard;
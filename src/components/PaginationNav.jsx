import React, { useEffect, useState } from "react"

 export default function PaginationNav({page,setPage,pageCount}){
    
    const[pages,setPages] = useState([]);

    useEffect(()=>{
        setPages(()=>generatePages());
    },[page])

  const generatePages = ()=>{

      if (pageCount <= 1) return [1];

  const pages = [];
  let lastPage = 0;

  for (let i = 1; i <= pageCount; i++) {
    if (
      i === 1 ||
      i === pageCount ||
      Math.abs(i - page) <= 1
    ) {
      if (lastPage  && i - lastPage > 1) {
        pages.push("...");
      }
      pages.push(i);
      lastPage = i;
    }
  }

  return pages;
  }

  const handleClick = (item) =>{
    if(item === '...') return;
    setPage(item);
  }

  return(<div className="flex justify-center gap-7 w-[20%]">
    {pages.length > 0 && pages.map((i,index)=>{
       
        return(
        <button className="border bg-gray-100 p-2 rounded-[.5rem]" key={index}  onClick={()=>handleClick(i)}>
            {i}
        </button>)
    })}
  </div>)
}




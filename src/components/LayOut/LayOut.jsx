import React from "react";

import Header from "../header/header";

function LayOut({children}){

  return(
      <div className="h-screen  p-0 m-0">
        <div className="flex-none fixed z-40 w-full m-0 p-0"><Header/></div> 
        <div className="flex-grow bg-gray-200  m-0 p-0 min-h-full pt-20 ">{children}</div>
      </div>
  );
}

export default LayOut;
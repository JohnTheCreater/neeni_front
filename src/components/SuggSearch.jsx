import { React, useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";



const SuggSearch = ({ 
  size = 280,
  onChange
}) => {








  const handleInputChange = (e) => {

    const value = e.target.value;
    const trimmedValue = value.trim();
    onChange(trimmedValue);
    
  };


  return (
    <div className="flex justify-end items-center">

      <FaSearch size={30} />

      <input
        style={{ width: size }}
        className={`max-w-60
            m-2
         border border-gray-500 p-2  rounded-[100rem] outline-none`}

        type="text"
        onChange={handleInputChange}
        placeholder="Search Name..."
      />

    </div>
  );
};

export default SuggSearch;
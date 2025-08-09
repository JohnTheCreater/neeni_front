import { React, useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";



const SuggSearch = ({ key,
  data,
  size=280,
  setSuggestion,
  searchAttribute=null
}) => {
  const [inputValue, setInputValue] = useState("");

  // useEffect(() => {
  //   setInputValue(selectedItem);

  // }, [selectedItem]);

 

  

  const handleInputChange = (e) => {

    const value = e.target.value;
    if (value === "") {
      setInputValue("");
      setSuggestion(data)
    } else {
      setInputValue(value);
      const filterName = data.filter(
        (obj) => obj && obj[searchAttribute].toString().toLowerCase().includes(value.toLowerCase())
      );
      setSuggestion(filterName);
    }
  };
//   const handleKeyDown = (e) => {
  
//     if (e.key === "Enter") {
//       e.preventDefault()
//       if (selectedSuggestion !== -1) {
//         handleNameSelect(suggestion[selectedSuggestion]);
//       } else if (suggestion.length > 0) {
//         handleNameSelect(suggestion[0]);
//       } else if(suggestion.length==0){
//         setInputValue("");
//       }
//     }
//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setSelectedSuggestion((prevIndex) =>
//         prevIndex > 0 ? prevIndex - 1 : suggestion.length - 1
//       );
//     } else if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setSelectedSuggestion((prevIndex) =>
//         prevIndex < suggestion.length - 1 ? prevIndex + 1 : 0
//       );
//     }
//   };

  

  // useEffect(()=>{

  //   console.log("ghhh",inputValue)

  // },[inputValue])

  return (
    <div className="flex justify-end items-center">

        <FaSearch size={30} />

      <input
      style={{width:size}}
        className={`max-w-60
            m-2
         border border-gray-500 p-2  rounded-[100rem] outline-none`}
         
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search Name..."
      />
      
    </div>
  );
};

export default SuggSearch;
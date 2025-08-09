import { React, useState, useEffect } from "react";

const Search = ({
  key,
  data,
  setSelectedItem,
  selectedItem,
  size,
  suggLength,
  searchAttribute=null
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  // useEffect(() => {
  //   setInputValue(selectedItem);

  // }, [selectedItem]);

  useEffect(()=>{
    console.log("key:",key)
    console.log("selectedItem:",selectedItem)
    setInputValue(selectedItem[searchAttribute]||"");

  },[selectedItem])

  useEffect(() => {
    setSelectedSuggestion(-1);
  }, [suggestion]);

  const handleInputChange = (e) => {

    const value = e.target.value;
    if (value === "") {
      setInputValue("");
      setSelectedItem({});
      setSuggestion([])
    } else {
      setInputValue(value);
      const filterName = data.filter(
        (obj) => obj && obj[searchAttribute].toString().toLowerCase().includes(value.toLowerCase())
      );
      setSuggestion(filterName);
    }
  };
  const handleKeyDown = (e) => {
  
    if (e.key === "Enter") {
      e.preventDefault()
      if (selectedSuggestion !== -1) {
        handleNameSelect(suggestion[selectedSuggestion]);
      } else if (suggestion.length > 0) {
        handleNameSelect(suggestion[0]);
      } else if(suggestion.length==0){
        setInputValue("");
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestion((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestion.length - 1
      );
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestion((prevIndex) =>
        prevIndex < suggestion.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const handleNameSelect = (obj) => {
    
      setInputValue(obj[searchAttribute]);
      setSuggestion([]);
      setSelectedItem(obj);
    
  };

  // useEffect(()=>{

  //   console.log("ghhh",inputValue)

  // },[inputValue])

  return (
    <div className="">
      <input
      style={{width:size}}
        className={`max-w-60
         border p-1 rounded-[0.4rem]`}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="select name"
      />
      {inputValue && suggestion.length > 0 && (
        <div style={{width:suggLength}} className={`p-2 absolute  overflow-auto max-h-52 mx-1 glass  border `}>
          <ul className=" ">
            {suggestion.map((obj, index) => {
              return (
                <li
                  key={index}
                  className={
                    index === selectedSuggestion
                      ? "bg-accent-content text-white p-1"
                      : "p-1"
                  }
                  onClick={() => handleNameSelect(obj)}
                >
                  {obj[searchAttribute]}{" "}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;

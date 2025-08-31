import { React, useState, useEffect, useRef } from "react";

const Search = ({
  onChange,
  setSelectedItem,
  selectedItem,
  size,
  suggLength,
  searchAttribute = null
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [loading, setLoading] = useState(false);

  const suggestionRefs = useRef([]);

  useEffect(() => {
    setInputValue(selectedItem[searchAttribute] || "");
  }, [selectedItem, searchAttribute]);

  useEffect(() => {
    setSelectedSuggestion(-1);
  }, [suggestion]);

  useEffect(() => {
    if (
      selectedSuggestion !== -1 &&
      suggestionRefs.current[selectedSuggestion]
    ) {
      suggestionRefs.current[selectedSuggestion].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedSuggestion]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setLoading(true);

    if (value === "") {
      setInputValue("");
      setSelectedItem({});
      setSuggestion([]);
      setLoading(false);
      return;
    }

    setInputValue(value);
    const result = await onChange(value);
    setSuggestion(result || []);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestion !== -1) {
        handleNameSelect(suggestion[selectedSuggestion]);
      } else if (suggestion.length > 0) {
        handleNameSelect(suggestion[0]);
      } else if (suggestion.length === 0) {
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

  return (
    <div className="relative">
      <input
        style={{ width: size }}
        className="max-w-60 border p-1 rounded-[0.4rem]"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder='find...'
      />
      {inputValue && suggestion.length > 0 && (
        <div
          style={{ width: suggLength }}
          className="p-2 absolute overflow-auto max-h-52 mx-1 glass border"
        >
          {loading ? (
            <ul>
              <li className="p-1">Loading...</li>
            </ul>
          ) : (
            <ul>
                {suggestion.map((obj, index) => (
                  <li
                    key={index}
                    ref={(el) => (suggestionRefs.current[index] = el)} 
                    className={
                      index === selectedSuggestion
                        ? "bg-accent-content text-white p-1"
                        : "p-1"
                    }
                    onClick={() => handleNameSelect(obj)}
                  >
                    {obj[searchAttribute]}
                  </li>
                ))
              }
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;

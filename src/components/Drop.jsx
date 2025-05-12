import {React,useState} from 'react'

const Drop = ({option,setOption,list=[],attribute=null,disabled=false}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
      if(disabled)
        return;
      setIsOpen(!isOpen);
    };
  
    const handleItemClick = (index) => {
      setOption(list[index])
      setIsOpen(false);
    };
  
    return (
      <div className={`dropdown  dropdown-bottom `}>
        <div
          tabIndex={0}
          role="button"
          className="btn m-1 min-w-20 bg-white"
          onClick={toggleDropdown}
        >{attribute!=null && attribute in option?option[attribute]:option}</div>
        <ul
          tabIndex={0}
          className={`dropdown-content ${
            isOpen ? "block" : "hidden"
          } menu bg-white rounded-box z-[2] w-52 max-h-52 overflow-auto  p-2 shadow`}
        >
        {
            list.map((item,index)=>(
                <li key={index} onClick={() => handleItemClick(index)}><a>{attribute!==null && attribute in item?item[attribute]: item}</a></li>
            ))
        }
          
        </ul>
      </div>
    );
}

export default Drop
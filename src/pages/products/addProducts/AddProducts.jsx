import React, { useEffect, useState } from "react";
import axios from 'axios'
import {API_URL} from '../../../config'
import MessageBoard from "../MessageBoard";
const AddProducts = () => {
  const [type, setType] = useState(1);
  const [productName, setProductName] = useState("");
  const [priceDetails, setPriceDetails] = useState({});

  const [productNameErorr,setProductNameErorr]=useState("");
  const [messageBoard,setMessageBoard]=useState({message:"",title:"",state:false});
  const [isLoaderOn,setIsLoaderOn]=useState(false);
//core product
  const core_p=['Sesame','Groundnut','Coconut']
  useEffect(() => {
    console.log(priceDetails);
  }, [priceDetails]);

  useEffect(()=>{
    refreshInputs();
  },[type])

  const refreshInputs=async ()=>{
    setProductName("");
    setProductNameErorr("");
    setMessageBoard({message:"",title:"",state:false})
    setPriceDetails({});

  }

  const handleSubmit = (e) => {
    setIsLoaderOn(true);
    e.preventDefault();

    if (productName === '') {
        setProductNameErorr("Enter Product Name!");
        setIsLoaderOn(false);
        return; 
    }

    const items = Object.keys(priceDetails);
    if ((type === 1 && items.length < 3) || (type === 2 && items.length < 1)) {
        setMessageBoard({message:'please fill fields for all the options!',title:"Fill Details!",state:true});
        setIsLoaderOn(false);
        return; 
    }

    let flag = false;
    for (const key of items) {
        if ((type===1 && Object.keys(priceDetails[key]).length < 5) ||(type==2 && Object.keys(priceDetails[key]).length < 1) ) {
            setMessageBoard({message:`please fill all fields for ${core_p[key-1]}!`,titel:"Fill Full Details!",state:true});
            flag = true;
            
            return; 
        }

        for (const item in priceDetails[key]) {
            if (!priceDetails[key][item] || priceDetails[key][item] === '') {
                setMessageBoard({message:`please fill all fields for ${core_p[key-1]}!`,title:"Fill Full Details!",state:true});
                flag = true;
                
                return;
            }
        }
    }

    if (flag){setIsLoaderOn(false); return;}

    axios.post(`${API_URL}/api/insertProduct`, { type, productName, priceDetails })
        .then(res =>{
          setIsLoaderOn(false);
        refreshInputs()
        setMessageBoard({message:"Product is Added!",title:"Success!",state:true})

      })
        .catch(err =>{
           setMessageBoard({message:err.response.data,title:"Error!",state:true})
           setMessageBoard(false);
  });
      
};


  

  return (
    <div className="flex flex-col border shadow-lg justify-center items-center h-screen">
      
                  <div className='p-2 font-bold'>Add Products</div>
      <div className="w-[80%] bg-white rounded-lg  shadow-xl">
      {messageBoard.state && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div> {/* Overlay */}
          <div className="absolute left-[40%] top-[40%] z-50">
            <MessageBoard messageBoard={messageBoard} setMessageBoard={setMessageBoard} />
          </div>
        </>
      )}
        <form className=" m-5 relative" onSubmit={handleSubmit}>
          {/* {messageBoard.state&&
        <div className="absolute left-[40%] top-[40%] ">
          <MessageBoard messageBoard={messageBoard} setMessageBoard={setMessageBoard}/>
          </div>} */}
      
            <div className="flex justify-center items-center gap-4">
      <div className="mb-2">
            <lable className="font-medium" >Product Name:</lable>
            <input value={productName} onChange={(e)=>{
                setProductName(e.target.value)
                setProductNameErorr('')
                }} className={` p-1 border ${productNameErorr?'border-red-500 placeholder-red-400 ':''} `} placeholder={`${productNameErorr||''}`}></input>
          </div>
          <div className="mb-2 ">
            <lable className="font-medium">Type:</lable>
            <TypeDrop type={type}  setType={setType} />
          </div>
          </div>
         
          <div className=" mb-2">
            {type === 1 ? (
              <Type1 priceDetails={priceDetails} setPriceDetails={setPriceDetails} />
            ) : (
              <Type2 setPriceDetails={setPriceDetails}/>
            )}
           
          </div>
          <div className="flex justify-center">
          <button className="btn btn-success min-w-[20%] font-medium text-white">
            {isLoaderOn?<div className="loading loading-spinner"></div>: <span>submit</span>
            }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




const Type1 = ({ setPriceDetails,priceDetails}) => {
    const[selectedOption,setSelectedOption]=useState('');
    const[coreProducts,setCoreProducts]=useState([])
    const[coreVolumes,setCoreVolumes]=useState([]);

    // const core_volumes=['1 LTR','1/2 LTR','200 ML','100 ML','CAKE'];

    useEffect(()=>{

      axios.post(`${API_URL}/api/get`,{tableName:'core_volume'})
      .then(res=> setCoreVolumes(res.data))
      .catch(err=>console.log(err))

      axios.post(`${API_URL}/api/get`,{tableName:'core_product'})
      .then(res=> setCoreProducts(res.data))
      .catch(err=>console.log(err))

    },[])

    const handleChangeOption=(item)=>{
        setSelectedOption(item.id)
    }

    const handleChange=(e,item)=>{

    
        setPriceDetails((prev)=>({
            ...prev,[selectedOption]:{...prev[selectedOption],[item.id]:e.target.value}}))
    
      }

  return (
    <div className="">

      <div className="flex justify-center ">
        <div className="join">
          { coreProducts.map(item=>{
            return(
              <input
            className="join-item btn"
            type="radio"
            name="options"
            aria-label={item.name}
          
            onChange={()=>handleChangeOption(item)}

          />

            )
          })
        }
          
          {/* <input
            className="join-item btn"
            type="radio"
            name="options"
            aria-label="Groundnut"
            
            onChange={handleChangeOption}
          />
          <input
            className="join-item btn"
            type="radio"
            name="options"
            aria-label="Coconut"
            onChange={handleChangeOption}
          /> */}
        </div>
      </div>
      <div className={` ${selectedOption===''?'bg-base-200':'bg-base-100'} border w-[100%] mt-2`}>
        {
            coreVolumes.map((item,index)=>(
                <div key={index} className="flex justify-between items-center m-1 p-1">
                    <lable>{item.name}:</lable>
                    <input className="p-1 border" disabled={selectedOption===''} 
                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                    type="number"
                     value={priceDetails[selectedOption]?.[item.id]|| ''} 
                    name={item.name} onChange={(e)=>handleChange(e,item)}
                    ></input>
                </div>
            ))
        }

      </div>
    </div>
  );
};

const Type2 = ({ setPriceDetails }) => {
  return (
    <div className="justify-center items-center flex">
      <lable className={' font-bold'}>Price: </lable>
      <input
        className="p-1 border m-2"
        name="price"
        onChange={(e) => 
            setPriceDetails({ [e.target.name]: e.target.value })
        }
      ></input>
    </div>
  );
};

function TypeDrop({ type, setType }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (type) => {
    setType(type);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown  dropdown-bottom `}>
      <div
        tabIndex={0}
        role="button"
        className="btn m-1 bg-white"
        onClick={toggleDropdown}
      >{`type ${type}`}</div>
      <ul
        tabIndex={0}
        className={`dropdown-content ${
          isOpen ? "block" : "hidden"
        } menu bg-white rounded-box z-[1] w-52 p-2 shadow`}
      >
        <li>
          <a onClick={() => handleItemClick(1)}>Type 1</a>
        </li>
        <li>
          <a onClick={() => handleItemClick(2)}>Type 2</a>
        </li>
      </ul>
    </div>
  );
}

export default AddProducts;

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Calendar from "react-calendar";

import LayOut from "../../components/LayOut/LayOut";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Production from "./Production";
import { API_URL } from "../../config";
import { NavLink, useNavigate } from "react-router-dom";
import Drop from "../../components/Drop";
import { IoClose } from "react-icons/io5";
import MessageBoard from "../products/MessageBoard";
import dayjs from 'dayjs'



const AddTotalStack=({oil,output,setAddTotalStack,handleAddTotalSubmit,isTotalStackAddLoaderOn})=>{
  
  const [selectedOil,setSelectedOil]=useState(oil[0]);
  const [selectedOutput,setSelectedOutput]=useState(output[0]);
  const[value,setValue]=useState('');

  const [isCalendarOpen,setIsCalendarOpen] = useState(false);
  const [date,setDate] = useState(new Date()); 
    useEffect(() => {
      setIsCalendarOpen(false)
  
    }, [date])

  return(
    <div className="bg-white p-4 flex flex-col justify-center items-center rounded-xl">
      <div className="flex justify-between w-full">
      <Drop list={oil} option={selectedOil} setOption={setSelectedOil}/>
      <Drop list={output} option={selectedOutput} setOption={setSelectedOutput}/>
        <button className="btn m-1" onClick={() => setIsCalendarOpen(true)}>{dayjs(date).format("DD-MM-YYYY")}</button>
      
      {
      isCalendarOpen && <div className="absolute">
        
          <Calendar onChange={setDate} value={date} />

        </div>
        }
      <div className="flex justify-center items-center">
      <button className="p-1 bg-error rounded-xl text-white " onClick={()=>setAddTotalStack(false)}><IoClose />      </button>
      </div>

      </div>
      <div>
        <lable className="font-medium">value:</lable>
      <input type="number" className="p-1 border m-2" onChange={(e)=>setValue(e.target.value)}></input>
      </div>
      <button className="btn btn-success text-white" onClick={()=>handleAddTotalSubmit(selectedOil,selectedOutput,value,date)}>{isTotalStackAddLoaderOn?<div className="loading loading-spinner"></div>:<span>Submit</span>}</button>
      </div>
  )
}


const AddBottles=({index,handleAddBottleSelect,options,handleAddBottleSubmit,isAddBottlesLoaderOn})=>{

  const [selectedOption,setSelectedOption]=useState(options[0])
  const [value,setValue]=useState('')

  return(
    <div className="bg-white p-2 flex flex-col items-center">
      <div className="flex justify-between items-center">
      <Drop list={options} option={selectedOption} setOption={setSelectedOption}/>
      <button className="p-1 bg-error rounded-xl text-white   " onClick={()=>handleAddBottleSelect(index)}><IoClose />      </button>
      </div>
      <div className="m-1 ">
        <label className="font-medium">value:</label>
      <input type="number" className="w-full border p-1" onChange={(e)=>setValue(e.target.value)}></input>

      </div>
      <div>
        <button className="btn btn-success text-white" onClick={()=>handleAddBottleSubmit(index,selectedOption,value)}>{isAddBottlesLoaderOn?<div className="loading loading-spinner"></div>:<span>Submit</span>}</button>
      </div>
    </div>
  )
}



const Slide = ({ list, shop,total_stack,dataNeed,setDataNeed,setMessageBoard }) => {
  const oil = ["Sesame", "Groundnut", "Coconut"];
  const output=["oil","cake"];
  const volume = ["1 LTR","1/2 LTR","200 ML","100 ML","CAKE"];
  const color = ["red", "yellow", "blue"];

  const shopp = shop === "Unit 1" ? 1 : 2;
  const [oilList, setOilList] = useState([]);
  const [cakeList, setCakeList] = useState([]);
  const [splitesList, setSplitesList] = useState({});
  const [addBottles,setAddBottles]=useState([false,false,false]);
  const [addTotalStack,setAddTotalStack]=useState(false);

  const[isAddBottlesLoaderOn,setIsAddBottlesLoaderOn]=useState(false)
  const[isTotalStackAddLoaderOn,setIsTotalStackAddLoaderOn]=useState(false)



  const handleAddBottleSubmit=(index,option,value)=>{

    setIsAddBottlesLoaderOn(true)
    console.log("add bott")
    if(value)
    {
    axios.post(`${API_URL}/api/addBottles`,{sid:shopp,cpid:index+1,cvid:volume.indexOf(option)+1,value:value})
    .then(res=>{
      console.log(res)
      handleAddBottleSelect(index)
      setDataNeed(!dataNeed);
    })
    .catch(err=>setMessageBoard({title:"Oops!",message:err.response.data,state:true}))
    .finally(()=>setIsAddBottlesLoaderOn(false))
    }
    else
    {
      setMessageBoard({title:"Invalid input!",message:"please verify the input!",state:true})
      setIsAddBottlesLoaderOn(false)
    }

  }

  const handleAddBottleSelect=(index)=>{

    setAddBottles(prev=>prev.map((item,i)=>i===index?!item:false))

  }
 //add total stack submit

 const handleAddTotalSubmit=(selectedOil,selectedOutput,value,date)=>{

  setIsTotalStackAddLoaderOn(true)
  if(value)
  {
  axios.post(`${API_URL}/api/addStack`,{cpid:oil.indexOf(selectedOil)+1,opid:output.indexOf(selectedOutput)+1,value:parseFloat(value).toFixed(2),sid:shopp,date})
  .then(res=>{
    console.log(res);
    setAddTotalStack(false);
    setDataNeed(!dataNeed)
  })
  .catch(err=>setMessageBoard({title:"Oops!",message:err.response.data,state:true}))
  .finally(()=> setIsTotalStackAddLoaderOn(false))
}
else
{
  setMessageBoard({title:"Invalid input!",message:"please verify the input!",state:true})
  setIsTotalStackAddLoaderOn(false)
}
  

 }



  useEffect(()=>{
        console.log(addBottles)

  },[addBottles])
  let splites_list={}
 
  useEffect(() => {
    const splites = list.reduce((acc, item) => {
      const productId = `${item.cpid}`;
      const volumeId = `${item.cvid}`;
      if (!acc[productId]) {
        acc[productId] = {};
      }
      acc[productId][volumeId] = item.quantity;
      return acc;
    }, {});
    setSplitesList(splites);
    // if(splitesList&&splitesList[1]&&splitesList[1][1])
    // console.log(splitesList[1][1]);
  }, [list]);


  useEffect(() => {

    const oil_stack = Array.isArray(total_stack)
      ? total_stack.reduce((acc, item) => {
          if (item.opid===1) acc.push(item);
          return acc;
        }, [])
      : [];

    console.log("haha",total_stack);
    setOilList(oil_stack);
    const cake_stack = Array.isArray(total_stack)
      ? total_stack.reduce((acc, item) => {
          if (item.opid === 2) acc.push(item);
          return acc;
        }, [])
      : [];
    setCakeList(cake_stack);
  }, [total_stack]);
  
  function normalizeZero(value) {
    return value === 0 ? 0 : value;
  }

  return (
    <div className="rounded-[1rem] glass bg-gray-600  p-4 min-w-full min-h-60">
      <div className="flex flex-col md:flex-row w-full justify-between">
        <div className="h-60 flex flex-col justify-between">
          <div className="min-w-[5%] md:min-w-[20%]">
            <span className="text-2xl text-white font-bold">{shop} Shop</span>
          </div>
          {addTotalStack && <div className="relative">
                <div className="absolute z-10">
                  <AddTotalStack oil={oil} output={output} handleAddTotalSubmit={handleAddTotalSubmit} setAddTotalStack={setAddTotalStack} isTotalStackAddLoaderOn={isTotalStackAddLoaderOn} />

                </div>
                </div>} 
          <table className=" w-full table  rounded-[.2rem] md:w-[40%]">
            <thead>
              <tr>
                <th className="glass "></th>
                <th className="bg-red-500 glass text-white p-0 md:p-3">
                  Sesame
                </th>
                <th className="bg-yellow-500 glass text-white p-0 md:p-3">
                  Groundnut
                </th>
                <th className="bg-blue-500 glass text-white p-0 md:p-3">
                  Coconut
                </th>
              </tr>
            </thead>
            <tbody>
              
              <tr>
                <th className="glass   md:min-w-40">Stack Oil</th>

                {oilList.length > 0
                  ? oilList.map((item, index) => (
                      <td className={`bg-${color[index]}-500 glass font-medium`} key={index}>
                        {parseFloat(item.quantity).toFixed(2)??0}
                      </td>
                    ))
                  : oil.map((item,index) => (
                      <td className="skeleton rounded-[0px]" key={index}></td>
                    ))}
              </tr>
              <tr className="">
                <th className="glass  md:min-w-40">Stack Cake</th>
                {cakeList.length > 0
                  ? cakeList.map((item, index) => (
                      <td className={`bg-${color[index]}-500 glass font-medium`} key={index}>
                        {parseFloat(item.quantity).toFixed(2)??0}
                      </td>
                    ))
                  : oil.map((item,index) => (
                      <td className="skeleton rounded-[0px]" key={index}></td>
                    ))}
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end p-2">
          <button className="btn btn-neutral" onClick={()=>setAddTotalStack(!addTotalStack)}>add stack</button>
          </div>
          

        </div>

        <div className="hidden md:flex md:flex-wrap md:justify-between   md:min-w-[50%]">
          {Object.keys(splitesList).length > 0
            ? Object.keys(splitesList).map((key, index) => {
                return (
                  <div className={`min-w-[25%] rounded-t flex bg-${color[index]}-500 text-black flex-col flex-wrap items-center `} key={index}>
                    <h1 className="text-3xl text-white m-3">{oil[key - 1]}</h1>
                    {addBottles[index]&&<div className="relative w-full ">
                      <div className="absolute z-10 m-2">
                        <AddBottles index={index} handleAddBottleSubmit={handleAddBottleSubmit} options={volume} handleAddBottleSelect={handleAddBottleSelect} isAddBottlesLoaderOn={isAddBottlesLoaderOn}/>
                      </div>
                      </div>
                      }

                    {
                      
                    Object.keys(splitesList[key]).map((item,index) => {

                        // console.log(splitesList)
                      return (
                        <div key={index} className="flex w-[100%] justify-between glass p-2">
                          <h1 className="text-xl flex justify-center">
                            {volume[item - 1]}
                          </h1>
                          <span className="font-medium">
                          {splitesList[key][item]}
                          </span>
                          {/* {splites_list[key][item].map((it,index) => (
                            <div
                            key={index}
                              className={`min-w-40 bg-${
                                color[key - 1]
                              }-400 overflow-hidden text-black rounded-[.2rem]  text-base-200 max-w-60`}
                            >
                              <div className="flex glass p-2 border-b justify-between">
                                <span>{volume[it.volume_id - 1]}</span>
                                <span>{it.stack}</span>
                              </div>
                            </div>
                          ))} */}
                        </div>
                      );
                    })}
                              
                              <button className="btn m-2 btn-neutral" onClick={()=>handleAddBottleSelect(index)} >add</button>
                  </div>
                  
                );
              })
            : Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className=" skeleton min-w-[15%] flex flex-col flex-wrap items-center text-gray-700">
                  <h1 className="text-sm">Loading...</h1>
                  {Array.from({ length: Object.keys(splites_list).length }).map(
                    (item) => (
                      <div>
                        <h1 className="text-lg flex justify-center">
                          Loading...
                        </h1>
                        {Array.from({ length: 4 }).map((it,index) => (
                          <div
                          key={index}
                            className={`skeleton min-w-40 overflow-hidden rounded-[.2rem] max-w-60`}
                          >
                            <div className="flex glass p-2 text-sm border-b justify-between">
                              <span>Loading...</span>
                              <span>Loading...</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

function Home() {
  const [stackData, setStackData] = useState([]);
  const [unit1Data, setUnit1Data] = useState([]);
  const [unit2Data,setUnit2Data] = useState([]);

  const [totalStack,setTotalStack]=useState([]);
  const [unit1TotalStack, setUnit1TotalStack] = useState([]);
  const [unit2TotalStack, setUnit2TotalStack] = useState([]);
  const [messageBoard,setMessageBoard]=useState({message:"",title:"",state:false});

  const [productionCounter,setProductionCounter] = useState(0)
  const [dataNeed,setDataNeed]=useState(false);

  const nav=useNavigate();

  useEffect(() => {
    axios
      .post(`${API_URL}/api/get`,{tableName:'avail_stack'})
      .then((result) => {
        setProductionCounter((prev => prev+1));
        setStackData(result.data);
        // console.log("joshuda", result);
      })
      .catch((err) => console.log(err));
  }, [dataNeed]);


  useEffect(() => {
    axios
      .post(`${API_URL}/api/get`,{tableName:'total_stack'})
      .then((result) => {
        
        setTotalStack(result.data);
        // console.log("joshuda", result);
      })
      .catch((err) => console.log(err));
  }, [dataNeed]);


  useEffect(() => {
    const unit1_stack = Array.isArray(stackData)
      ? stackData.filter((item) => item.sid === 1)
      : [];
    setUnit1Data(unit1_stack);
    const unit2_stack = Array.isArray(stackData)
      ? stackData.filter((item) => item.sid === 2)
      : [];
   setUnit2Data(unit2_stack);
  }, [stackData]);


  useEffect(() => {
    const unit1_total_stack = Array.isArray(totalStack)
      ? totalStack.filter((item) => item.sid === 1)
      : [];
    setUnit1TotalStack(unit1_total_stack);
    const unit2_total_stack = Array.isArray(totalStack)
      ? totalStack.filter((item) => item.sid === 2)
      : [];
    setUnit2TotalStack(unit2_total_stack);
  }, [totalStack]);

 

  const settings = {
    dots: true,
    infinite: true,
    cssEase: "ease-in-out",

    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <LayOut>
      <div className="p-10">
      {messageBoard.state && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div> {/* Overlay */}
          <div className="absolute left-[40%] top-[40%] z-50">
            <MessageBoard messageBoard={messageBoard} setMessageBoard={setMessageBoard} />
          </div>
        </>
      )}
        <Slider {...settings}>
          <div className="p-2 flex flex-wrap">
            <Slide list={unit1Data} dataNeed={dataNeed} setDataNeed={setDataNeed} setMessageBoard={setMessageBoard} shop={"Unit 1"} total_stack={unit1TotalStack} />
          </div>
          <div className="p-2">
            <Slide list={unit2Data} dataNeed={dataNeed} setDataNeed={setDataNeed} setMessageBoard={setMessageBoard} shop={"Unit 2"} total_stack={unit2TotalStack}/>
          </div>
        </Slider>
      </div>
      <div className="p-2">
        <Production key={productionCounter} setDataNeed={setDataNeed} />
      </div>
      <div className="flex justify-start m-3">
        <NavLink className={"text-blue-700 font-medium text-lg p-1 "} to={'/setAuthInfo'}>set password</NavLink>
      </div>
    </LayOut>
  );
}

export default Home;

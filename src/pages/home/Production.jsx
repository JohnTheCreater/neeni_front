import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";


import Drop from "../../components/Drop";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from 'dayjs'
import { API_URL } from "../../config";
import LogBox from './LogBox';
import LogType from "./LogType";

const AddRaw = ({ setIsAddRaw, products, type, setIsError}) => {

  const [selected, setSelected] = useState(type[0]);
  const [typeList, setTypeList] = useState(type);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [date, setDate] = useState(new Date());

  const [rawData, setRawData] = useState({ type: type.indexOf(selected) + 1, product: products.indexOf(selectedProduct) + 1, value: 0, date: date });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isSubmitLoaderOn,setIsSubmitLoaderOn]=useState(false)

  useEffect(() => {
    setRawData({ ...rawData, type: type.indexOf(selected) + 1 })
  }, [selected])

  useEffect(() => {
    setRawData({ ...rawData, product: products.indexOf(selectedProduct) + 1 })
  }, [selectedProduct])

  useEffect(() => {
    setRawData({ ...rawData, date: date })
  }, [date])

  const handleChange = (e) => {
    const value = e.target.value;
    if (value !== 0) setRawData({ ...rawData, value: value });
    else e.target.value = "";
  };
  useEffect(() => {
    if (products.indexOf(selectedProduct) === 3) {
      setTypeList([type[0]])
      setSelected(type[0])
    }
    else {
      setTypeList(type)
    }

  }, [type, selectedProduct])
  useEffect(() => {
    setIsCalendarOpen(false)

  }, [date])

  const handleProductionAddition =  () => {
    setIsSubmitLoaderOn(true)
    if (rawData.value) {
     axios
        .post(`${API_URL}/api/productionAddition`, {
          rawData: rawData,
        })
        .then((result) => {
          
          setIsAddRaw(false);
          // setIsSubmitClicked(false);

        })
        .catch(err=>console.log(err))
        .finally(()=>setIsSubmitLoaderOn(false))
    } else {
      setIsError({
        message: "you have no value! please enter a value!",
        value: true,
      });
      setIsSubmitLoaderOn(false)
    }
   
  };

  return (
    <div className="min-w-[20rem] rounded-[.4rem] border border-gray-600 p-4 min-h-[10rem] bg-white">
      { }
      <div className="md:flex justify-between max-w-[95%]">
        <Drop list={products} option={selectedProduct} setOption={setSelectedProduct} />
        <Drop list={typeList} option={selected} setOption={setSelected} />
        <button className="btn m-1" onClick={() => setIsCalendarOpen(true)}>{dayjs(date).format("DD-MM-YYYY")}</button>
        {isCalendarOpen && <div className="absolute">
          {" "}
          <Calendar onChange={setDate} value={date} />
        </div>}


        <div className="flex items-center">
          {" "}
          <input
            type="number"
            className="max-w-36 m-2 p-1 border border-gray-200 rounded-[.2rem]"
            placeholder="enter value..."
            onChange={handleChange}
          ></input>
          {products.indexOf(selectedProduct) === 0 ? <span className="font-bold">LTR</span> : <span className="font-bold">KG</span>}

        </div>
      </div>
      <div className="max-w-[80%] flex justify-between items-center mt-10">
        <button
          className="btn bg-red-500 text-white hover:bg-red-600"
          onClick={() => setIsAddRaw(false)}
        >
          <MdOutlineClose />
        </button>
        <button className="btn btn-success text-white" onClick={handleProductionAddition}>
          {isSubmitLoaderOn?<div className="loading loading-spinner"></div>:<span>Submit</span>}
        </button>
      </div>
    </div>
  );
};

const DoGrind = ({ setIsDoGrind, type, setIsError}) => {
  const [selected, setSelected] = useState(type[0]);
  const [grindData, setGrindData] = useState({});
  const [date, setDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isSubmitLoaderOn,setIsSubmitLoaderOn]=useState(false)


  useEffect(() => {
    setIsCalendarOpen(false)

  }, [date])

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value !== 0) {
      setGrindData({ ...grindData, [name]: value });
    }
  };

  useEffect(() => {
    setGrindData(prevGrindData => ({ ...prevGrindData, oilType: type.indexOf(selected) + 1, date: date }));
  }, [selected, date]);

  // useEffect(() => {
  //   console.log(grindData);
  // }, [selected, grindData]);

  const handleSubmit = () => {
    console.log("grind ", grindData.karupatti)
    setIsSubmitLoaderOn(true)
    if (grindData.used && grindData.grind && grindData.producedCake && grindData.producedOil) {
      axios
        .post(`${API_URL}/api/productionGrinding`, {
          grindData: grindData,
        })
        .then((result) => {
          
          console.log("res", result);
          setIsDoGrind(false);
          // setIsSubmitClicked(false);
        })
        .catch(err => setIsError({ message: err.response.data, value: true }))
        .finally(()=>setIsSubmitLoaderOn(false))

    }
    else
    {
      setIsError({ message: "please fill all the details!", value: true })
    setIsSubmitLoaderOn(false)
    }



  }

  return (
    <div className="min-w-full md:min-w-[20rem] rounded-[.4rem] border border-gray-600 p-4 min-h-[10rem] bg-white">
      <div className="md:flex justify-between ">
        <Drop
          list={type}
          setOption={setSelected}
          option={selected}
        />


        <div className="min-w-full mb-1 max-w-full md:min-w-[25%]  md:max-w-[25%] items-center flex justify-between">
          <lable className="font-bold">used</lable>
          <input
            name="used"
            type="number"
            className="max-w-20 p-1 border border-gray-200 rounded-[.2rem]"
            onChange={handleChange}
          ></input>
        </div>
        {type.indexOf(selected) === 0 && <div className="min-w-full mb-1 max-w-full md:min-w-[25%]  md:max-w-[45%] p-1 gap-1 items-center flex justify-between">
          <lable className="font-bold">karupatti</lable>
          <input
            name="karupatti"
            type="number"
            className="max-w-20 p-1 border border-gray-200 rounded-[.2rem]"
            onChange={handleChange}
          ></input>
        </div>}

        <div className="min-w-full max-w-full md:min-w-[18%] items-center flex justify-between">
          <lable className="font-bold">grind</lable>
          <input
            name="grind"
            type="number"
            onChange={handleChange}
            className="max-w-20 md:max-w-10 p-1 border border-gray-200 rounded-[.2rem]"
          ></input>
        </div>
      </div>
      <div className="md:flex mt-5 justify-between w-full">
        {" "}
        <div>
          <div className="flex justify-between items-center min-w-[43%] m-1">
            <lable className="font-bold mr-5">produced oil</lable>
            <div>
              <input
                onChange={handleChange}
                name="producedOil"
                type="number"
                className="max-w-10 p-1 border border-gray-200 rounded-[.2rem]"
              ></input>
              <span className="font-bold p-1">ltr</span>
            </div>
          </div>
          <div className="flex justify-between items-center min-w-[43%] m-1">
            <lable className="font-bold mr-5">produced cake</lable>
            <div>
              <input
                onChange={handleChange}
                name="producedCake"
                type="number"
                className="max-w-10 p-1 border border-gray-200 rounded-[.2rem]"
              ></input>
              <span className="font-bold p-1">kg</span>
            </div>
          </div>

        </div>
        <div className="flex items-center">
          <button className="btn m-1" onClick={() => setIsCalendarOpen(true)}>{dayjs(date).format("DD-MM-YYYY")}</button>
          {isCalendarOpen && <div className="absolute">
            {" "}
            <Calendar onChange={setDate} value={date} />
          </div>}
        </div>
        <div className="flex justify-between items-center min-w-[30%]">
          <button
            className="btn bg-red-500 text-white hover:bg-red-600"
            onClick={() => setIsDoGrind(false)}
          >
            {" "}
            <MdOutlineClose />
          </button>
          <button className="btn btn-success text-white" onClick={handleSubmit}>{isSubmitLoaderOn?<div className="loading loading-spinner"></div>:<span>Submit</span>}</button>
        </div>
      </div>
    </div>
  );
};

const Production = ({setDataNeed}) => {

  const color = ["red", "yellow", "blue"];
  const t = ['name', 'sesame', 'groundnut', 'coconut']
  const type = useMemo(() => ["sesame", "groundnut", "coconut"], [])
  const [isAddRaw, setIsAddRaw] = useState(false);
  const [isDoGrind, setIsDoGrind] = useState(false);
  const [prodInfo, setProdInfo] = useState([]);
  const [list, setList] = useState([]);
  const [isUndoOperation,setIsUndoOperation] = useState(false);
  const shops = ["Unit 1","Unit 2"];
  const outputs = ["Oil","Cake"];


  const[logBoxKey,setLogBoxKey] = useState(0);





  const [productionProducts, setProductionProducts] = useState([]);

 
 

  const [isError, setIsError] = useState({ message: "", value: false });

  useEffect(() => {

    axios.post(`${API_URL}/api/get`, { tableName: 'production_products' })
      .then(res => setProductionProducts(res.data.map(item => item.name)))

  }, [])
 

  

  const updateStackData = ()=>{

    axios.post(`${API_URL}/api/get`, { tableName: 'production_stack' }).then((result) => {
      setProdInfo(result.data);
      
    });

  }

  useEffect(() => {

    updateStackData();

    if(!isAddRaw)
    {
        setLogBoxKey((prevKey) => prevKey + 1);
    }
    if(!isDoGrind)
      {
        setLogBoxKey((prevKey) => prevKey + 1);
      }
  

  }, [isAddRaw,isDoGrind]);

  useEffect(()=>{

    updateStackData();

  },[isUndoOperation])


  useEffect(() => {

    setList(() => {
      const obj = Array.isArray(prodInfo) ? prodInfo.reduce((acc, item) => {
        if (!acc[item.ppid]) {
          acc[item.ppid] = {};
        }
        acc[item.ppid] = { ...acc[item.ppid], [item.cpid]: item.quantity };
        return acc;
      }, {})
        : {};

      return Object.entries(obj).map(([ppid, stack]) => ({ ppid, stack }));
    });

  }, [prodInfo]);


 


  



  const constructLogList = (logs) =>
  {
    console.log("Production products:" , productionProducts)
    const newLogList = Array.isArray(logs) ? logs.map((item, index) => {
      if (item.usedRaw) {
        return {
          ...item,
          message: `${item.usedRaw} KG raw ${type[item.cpid - 1]} ${item.cpid == 1 ? `, ${item.usedKarupatti} KG ${productionProducts[3]}` : ''} used, ${item.grind} grinds and ${item.produced_oil} ltr ${type[item.cpid - 1]} oil,${item.produced_cake} kg ${type[item.cpid - 1]} cake  produced on ${dayjs(item.date).format("DD-MM-YYYY")}! `,
          typ: LogType.GRIND, id2: index
        };
      }
      else if(item.sid)
      {
        return {
          ...item,
          message:`${Math.abs(item.quantity)} ${item.opid == 1 ? 'LTR' : 'KG'} of ${type[item.cpid-1]} ${outputs[item.opid-1]} ${Number(item.quantity) < 0?'has returned to production from ': 'had been sent to'} ${shops[item.sid-1]} on ${dayjs(item.date).format("DD-MM-YYYY")}!`,
          typ:LogType.TRANSACTION,id2:index
        }
      }
       else {
        return {
          ...item,
          message: `${parseFloat(item.quantity).toFixed(2)} ${item.ppid == 1 ? 'LTR' : 'KG'}  ${type[item.cpid - 1]} ${productionProducts[Number(item.ppid) - 1]} added on ${dayjs(item.date).format("DD-MM-YYYY")}!`,
          typ: LogType.ADD, id2: index
        };
      }
    }) : [];

    newLogList.sort((a, b) => {
     const diff = new Date(b.date) - new Date(a.date)
     if(diff == 0)
      return b.typ - a.typ;
    return diff;
    });
    return newLogList;

  }


 



  const handleUndo = (item) => {

    if (window.confirm("Are you sure you want to undo this action?")) {
      setIsUndoOperation(true);
      return axios
        .post(`${API_URL}/api/undo`, { id: item.id, type: item.typ })
        .then((result) => {
          console.log("Undo performed successfully!", item);
          setIsUndoOperation(false);
          setDataNeed((prev)=> !prev)

          
        })
        .catch((err) => {
          console.error("Error performing undo:", err);
          alert("Failed to undo the action. Please try again.");
          setIsUndoOperation(false);
        });
        
    }

  };

  return (
    <div className="md:flex rounded-[1rem] glass bg-gray-600 p-4 min-w-full min-h-60">
      {isError.value && (
        <div className="max-w-[20%] rounded-[.3rem] min-w-[20%] min-h-[40%] mx-80 absolute bg-gray-200 text-neutral shadow-xl z-[100] ">
          <div className="flex flex-col items-center  justify-center m-4">
            {" "}
            <div className="text-center  font-bold min-h-[50%] flex items-center justify-center">
              {isError.message}
            </div>
            <button
              className="bg-yellow-500 text-black hover:bg-yellow-400 btn border-yellow-300 mt-7"
              onClick={() => setIsError({ message: "", value: false })}
            >
              ok
            </button>
          </div>
        </div>
      )}
      {isAddRaw && (
        <div className="  absolute min-w-[20%] md:min-w-[40%]    z-40">
          <AddRaw setIsAddRaw={setIsAddRaw} products={productionProducts} type={type} setIsError={setIsError} />
        </div>
      )}
      {isDoGrind && (
        <div className=" absolute  min-w-[20%]  md:min-w-[40%]    z-40">
          <DoGrind setIsDoGrind={setIsDoGrind} type={type} setIsError={setIsError}  />
        </div>
      )}
      <div className="w-full md:w-[50%]">
        <table className=" w-full md:min-w-[80%] md:max-w-[80%] table table rounded-[.2rem]">
          <thead>
            <tr>
              <th className="glass"></th>
              <th className="bg-red-500 glass text-white">Sesame</th>
              <th className="bg-yellow-500 glass text-white">Groundnut</th>
              <th className="bg-blue-500 glass text-white">Coconut</th>
            </tr>
          </thead>
          <tbody>
           
            {list.length !== 0 ?
              list.map((items, index) => {
                return (
                  <tr className={``} key={index}>
                    <td className="glass text-neutral font-bold">{productionProducts[index]}</td>
                    {Object.keys(items.stack).map((item, index) => (
                      <td className={`bg-${color[index]}-500 glass`}>{items.stack[item] ?? 0}</td>
                    ))}
                  </tr>
                );
              }) : <tr className="h-36">{t.map(item => <td className="skeleton h-full rounded-[0px]"></td>)}</tr>}
          </tbody>
        </table>
        <div className=" min-w-full md:max-w-[80%] md:min-w-[80%] flex justify-between mt-5">
          <button
            className="btn btn-neutral "
            onClick={() => setIsAddRaw(true)}
          >
            {" "}
            add raw
          </button>
          <button
            className="btn btn-neutral"
            onClick={() => setIsDoGrind(true)}
          >
            {" "}
            do grind
          </button>
        </div>
      </div>
      <div className="flex flex-col  items-center min-w-1/2">
        

      {productionProducts.length > 0 ? (
    <LogBox key={logBoxKey} constructLogList={constructLogList} handleUndo={handleUndo} />
  ) : (
    <div>Loading...</div>
  )}
      </div>
    </div>
  );
};

export default Production;

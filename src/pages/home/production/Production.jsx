import { useEffect } from "react";
import { useState } from "react";
import DoGrind from "./DoGrind";
import AddRaw from "./AddRaw";
import "react-calendar/dist/Calendar.css";
import LogBox from '../log_box/LogBox';
import api from "../../../api/api";




const Production = ({baseInfo ,isDataUpdate, setIsDataUpdate}) => {

  const template = ['name', 'sesame', 'groundnut', 'coconut']
  
  const [isAddRaw, setIsAddRaw] = useState(false);
  const [isDoGrind, setIsDoGrind] = useState(false);
  const [productionStock, setProductionStock] = useState([]);
  const [list, setList] = useState([]);

  const {coreProducts,outputs,shops,color} = baseInfo;


  const[logBoxKey,setLogBoxKey] = useState(0);

  const [productionProducts, setProductionProducts] = useState([]);

 
 

  const [isError, setIsError] = useState({ message: "", value: false });

  useEffect(() => {

   api.get('/api/production')
   .then(result=>{
    console.log('production',result.data)
    setProductionProducts(result.data)
  })
   .catch(err=> console.warn(err));

  }, [])
 

  

  const updateStockData = ()=>{

    api.get(`/api/stock/production`).then((result) => {
      setProductionStock(result.data);
      
    });

  }

  useEffect(() => {

    updateStockData();

    if(!isAddRaw)
    {
        setLogBoxKey((prevKey) => prevKey + 1);
    }
    if(!isDoGrind)
      {
        setLogBoxKey((prevKey) => prevKey + 1);
      }
  

  }, [isAddRaw,isDoGrind,]);

  useEffect(()=>{

    updateStockData();

  },[isDataUpdate])


  useEffect(() => {

    setList(() => {
      const obj = Array.isArray(productionStock) ? productionStock.reduce((acc, item) => {
        if (!acc[item.ppid]) {
          acc[item.ppid] = {};
        }
        acc[item.ppid] = { ...acc[item.ppid], [item.cpid]: item.quantity };
        return acc;
      }, {})
        : {};

      return Object.entries(obj).map(([ppid, stock]) => ({ ppid, stock }));
    });

  }, [productionStock]);


 


  



  

  return (

    <div className="md:flex justify-between rounded-[1rem] glass bg-gray-600 p-4 min-w-full min-h-60">
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
          <AddRaw setIsAddRaw={setIsAddRaw} productionProducts={productionProducts} coreProducts={coreProducts} setIsError={setIsError} />
        </div>
      )}
      {isDoGrind && (
        <div className=" absolute  min-w-[20%]  md:min-w-[40%]    z-40">
          <DoGrind setIsDoGrind={setIsDoGrind} coreProducts={coreProducts} setIsError={setIsError}  />
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
           
            {list.length > 0  && productionProducts.length > 0?
              list.map((items, index) => 
                (
                  <tr className={``} key={index}>
                    <td className="glass text-neutral font-bold">{productionProducts[index].name}</td>
                    {Object.keys(items.stock).map((item, index) => (
                      <td key={index} className={`bg-${color[index]}-500 glass`}>{items.stock[item] ?? 0}</td>
                    ))}
                  </tr>
                )) : <tr className="h-36">{template.map((item,index) => <td key={index} className="skeleton h-full rounded-[0px]"></td>)}</tr>}
          </tbody>
        </table>
        <div className=" min-w-full md:max-w-[80%] md:min-w-[80%] flex justify-between mt-5">
          <button
            className="btn btn-neutral "
            onClick={() => setIsAddRaw(true)}
          >
          
            add raw
          </button>
          <button
            className="btn btn-neutral"
            onClick={() => setIsDoGrind(true)}
          >
            
            do grind
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center  md:w-1/2">
        

      {productionProducts.length > 0 ? (
          <LogBox key={logBoxKey}  productionProducts={productionProducts} coreProducts={coreProducts} outputs={outputs} shops={shops} setIsDataUpdate = {setIsDataUpdate}/>
  ) : (
    <div>Loading...</div>
  )}
      </div>
    </div>
  );
};

export default Production;

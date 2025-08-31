import { useEffect, useState } from "react";
import PackedForm from "./PackedForm";
import UnPackedForm from "./UnPackedForm";
import api from "../../../api/api";





const Slide = ({baseInfo, packedStock,unPackedStock,shop,setIsDataUpdate,setMessageBoard }) => {

  // const coreProducts = ["Sesame", "Groundnut", "Coconut"];
  // const outputs=["coreProducts","cake"];
  // const coreVolumes = ["1 LTR","1/2 LTR","200 ML","100 ML","CAKE"];
  // const color = ["red", "yellow", "blue"];

  const {coreProducts,coreVolumes,outputs,color} = baseInfo;

  const sid = shop.id;

  const [oilList, setOilList] = useState([]);
  const [cakeList, setCakeList] = useState([]);
  const [splitesList, setSplitesList] = useState({});
  const [isPackedForm,setIsPackedForm] = useState([false,false,false]);
  const [isUnpackedForm,setIsUnpackedForm] = useState(false);

  const[isPackedFormLoaderOn,setIsPackedFormLoaderOn]=useState(false)
  const[isUnPackedFormLoaderOn,setIsUnPackedFormLoaderOn]=useState(false)



  const handlePackedFormSubmit=(cpid,cvid,value)=>{

    setIsPackedFormLoaderOn(true)
    if(value)
    {
      console.log(cpid,cvid,value)
      api.patch(`/api/stock/updatePackedStock`,{sid,cpid,cvid,quantity:value})
        .then(res=>{
              console.log(res)
              setMessageBoard({title:"Success!",message:res.data.message,state:true});
              handlePackedFormSelect(-1)
              setIsDataUpdate(prev=>prev+1);
          })
      .catch(err=>setMessageBoard({title:"Oops!",message:err.response.data.message,state:true}))
      .finally(()=>setIsPackedFormLoaderOn(false))
    }
    else
    {
        setMessageBoard({title:"Invalid input!",message:"please verify the input!",state:true})
        setIsPackedFormLoaderOn(false)
    }

  }

  const handlePackedFormSelect = (index)=>{

    setIsPackedForm(prev=>prev.map((item,i)=>i===index?!item:false))

  }
 //add total stock submit

 const handleUnPackedFormSubmit = (cpid,opid,value,date)=>{

  setIsUnPackedFormLoaderOn(true)
  if(value)
  {
    console.log(cpid,opid,value,date);
  api.post(`/api/production/doTransaction`,{cpid,opid,quantity:parseFloat(value).toFixed(2),sid,date})
  .then(res=>{
    console.log(res);
    setIsUnpackedForm(false);
    setIsDataUpdate((prev)=>prev+1);
  })
  .catch(err => setMessageBoard({title:"Oops!",message:err.response.data.message,state:true}))
  .finally(()=> setIsUnPackedFormLoaderOn(false))
}
else
{
  setMessageBoard({title:"Invalid input!",message:"please verify the input!",state:true})
  setIsUnPackedFormLoaderOn(false)
}
  

 }




  let splites_list={}
 
  useEffect(() => {
    const splites = packedStock.reduce((acc, item) => {
      const productId = `${item.cpid}`;
      const volumeId = `${item.cvid}`;
      if (!acc[productId]) {
        acc[productId] = {};
      }
      acc[productId][volumeId] = item.quantity;
      return acc;
    }, {});
    setSplitesList(splites);
    
  }, [packedStock]);


  useEffect(() => {

    const oilStock = Array.isArray(unPackedStock)
      ? unPackedStock.reduce((acc, item) => {
          if (item.opid===1) acc.push(item);
          return acc;
        }, [])
      : [];

    
    setOilList(oilStock);
    const cakeStock = Array.isArray(unPackedStock)
      ? unPackedStock.reduce((acc, item) => {
          if (item.opid === 2) acc.push(item);
          return acc;
        }, [])
      : [];

    setCakeList(cakeStock);

  }, [unPackedStock]);


  return (
    <div className="rounded-[1rem] glass bg-gray-600  p-4 min-w-full min-h-60">
      <div className="flex flex-col md:flex-row w-full justify-between">
        <div className="h-60 flex flex-col justify-between">
          <div className="min-w-[5%] md:min-w-[20%]">
            <span className="text-2xl text-white font-bold">{shop?.name} </span>
          </div>
          {isUnpackedForm && <div className="relative">
                <div className="absolute z-10">
                  <UnPackedForm coreProducts={coreProducts} outputs={outputs} handleUnPackedFormSubmit={handleUnPackedFormSubmit} setIsUnpackedForm={setIsUnpackedForm} isUnPackedFormLoaderOn={isUnPackedFormLoaderOn} />

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
                <th className="glass   md:min-w-40">Un Packed Oil</th>

                {oilList.length > 0
                  ? oilList.map((item, index) => (
                      <td className={`bg-${color[index]}-500 glass font-medium`} key={index}>
                        {parseFloat(item.quantity).toFixed(2)??0}
                      </td>
                    ))
                  : Array.from({length:3}).map((item,index) => (
                      <td className="skeleton rounded-[0px]" key={index}></td>
                    ))}
              </tr>
              <tr className="">
                <th className="glass  md:min-w-40">Un Packed Cake</th>
                {cakeList.length > 0
                  ? cakeList.map((item, index) => (
                      <td className={`bg-${color[index]}-500 glass font-medium`} key={index}>
                        {parseFloat(item.quantity).toFixed(2)??0}
                      </td>
                    ))
                  : Array.from({length:3}).map((item,index) => (
                      <td className="skeleton rounded-[0px]" key={index}></td>
                    ))}
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end p-2">
          <button className="btn btn-neutral" onClick={()=>setIsUnpackedForm(!isUnpackedForm)}>add stock</button>
          </div>
          

        </div>

        <div className="hidden md:flex md:flex-wrap md:justify-between   md:min-w-[50%]">
          {Object.keys(splitesList).length > 0 && coreProducts.length > 0 && coreVolumes.length > 0
            ? Object.keys(splitesList).map((key, index) => {
                return (
                  <div className={`min-w-[25%] rounded-t flex bg-${color[index]}-500 text-black flex-col flex-wrap items-center `} key={index}>
                    <h1 className="text-3xl text-white m-3">{coreProducts[key - 1].name}</h1>

                    { isPackedForm[index]&&
                                <div className="relative w-full ">
                                  <div className="absolute z-10 m-2">
                                    <PackedForm index={index} handlePackedFormSubmit={handlePackedFormSubmit} coreVolumes={coreVolumes} handlePackedFormSelect={handlePackedFormSelect} isPackedFormLoaderOn={isPackedFormLoaderOn}/>
                                  </div>
                                  </div> }
                      

                    {
                      
                    Object.keys(splitesList[key]).map((item,index) => {

                      return (
                        <div key={index} className="flex w-[100%] justify-between glass p-2">
                          <h1 className="text-xl flex justify-center">
                            {coreVolumes[item - 1].name}
                          </h1>
                          <span className="font-medium">
                          {splitesList[key][item]}
                          </span>
                         
                        </div>
                      );
                    })}
                              
                      <button className="btn m-2 btn-neutral" onClick={()=>handlePackedFormSelect(index)} >add</button>
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

export default Slide;

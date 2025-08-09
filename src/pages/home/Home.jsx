import  { useEffect, useState } from "react";
import Slider from "react-slick";

import LayOut from "../../components/LayOut/LayOut";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Production from "./production/Production";
import { NavLink, useNavigate } from "react-router-dom";
import MessageBoard from "../products/MessageBoard";
import api from "../../api/api";
import Slide from "./slide/Slide";







function Home() {
  


  const [packedStock ,setPackedStock] = useState([]);
  const [unPackedStock,setUnPackedStock]=useState([]);

  const [messageBoard,setMessageBoard]=useState({message:"",title:"",state:false});

  const [productionCounter,setProductionCounter] = useState(0)
    const [isDataUpdate,setIsDataUpdate] = useState(0);


  const color = ["red", "yellow", "blue"];
  const [coreProducts,setCoreProducts] = useState([]);
  const [coreVolumes,setCoreVolumes] = useState([]);
  const [shops,setShops] = useState([]);
  const [outputs,setOutputs] = useState([]);

  const nav = useNavigate();

  useEffect(() => {

    api
      .get(`/api/stock/packed`)
      .then((result) => {
        console.log(result);
        setProductionCounter((prev => prev+1));
        setPackedStock(result.data);
      
      })
      .catch((err) => console.log(err));

  }, [isDataUpdate]);

  useEffect(()=>{

    api.get('/api/core/products')
          .then(res => setCoreProducts(res.data))
          .catch(err => console.warn(err))
    
    api.get('/api/core/shops')
          .then(res => setShops(res.data))
          .catch(err => console.warn(err))
      
    api.get('/api/core/outputs')
          .then(res => setOutputs(res.data))
          .catch(err => console.warn(err))

    api.get('/api/core/volumes')
          .then(res => setCoreVolumes(res.data))
          .catch(err => console.warn(err))



  },[])


  useEffect(() => {

    api
      .get(`/api/stock/unpacked`)
      .then((result) => {
        setUnPackedStock(result.data);
      })
      .catch((err) => console.log(err));

  }, [isDataUpdate]);


 

 


 

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
          <div className="fixed inset-0 bg-black opacity-50 z-40 "></div> 
          <div className="absolute left-[40%] top-[40%] z-50 ">
            <MessageBoard messageBoard={messageBoard} setMessageBoard={setMessageBoard} />
          </div>
        </>
      )}
        <Slider {...settings}>

          {shops.length > 0 &&
            shops.map((shop,index)=>
          <div className="p-2 flex flex-wrap"  key={index}>
            <Slide 
           
            baseInfo={{coreProducts,coreVolumes,outputs,color}}
            packedStock = {packedStock.filter((item) => item.sid === shop.id)} 
            setIsDataUpdate = {setIsDataUpdate} 
            setMessageBoard = {setMessageBoard}
            shop = {shop}
            unPackedStock = { unPackedStock.filter((item) => item.sid === shop.id)} />
          </div>
        )}

         

        </Slider>
      </div>
      <div className="p-2">
        <Production baseInfo = {{coreProducts,outputs,shops,color}} key={productionCounter}isDataUpdate={isDataUpdate} setIsDataUpdate={setIsDataUpdate} />
      </div>
      <div className="flex justify-start m-3">
        <NavLink className={"text-blue-700 font-medium text-lg p-1 "} to={'/setAuthInfo'}>set password</NavLink>
      </div>
    </LayOut>
  );
}

export default Home;

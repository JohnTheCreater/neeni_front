import React, { useEffect,useState } from 'react'
import Search from '../../../components/Search'
import axios from 'axios';
import { API_URL } from '../../../config';
import MessageBoard from '../MessageBoard';
import EditProducts from './EditProducts';
import InActiveProducts from './InActiveProducts';
import api from '../../../api/api';

const ManageProducts = () => {


  const [productList,setProductList]=useState([]);

  const [messageBoard,setMessageBoard]=useState({message:"",title:"",state:false});
 

  
  useEffect(()=>{
      
    api.get(`/api/product`)
    .then(res=>{

      setProductList(res.data)

    })
    .catch(err=>console.log(err));

  },[messageBoard])

 
  

  const isNoObjectSelected=(selectedProduct)=>{

    if((!selectedProduct?.name)|| (!selectedProduct?.price) ||selectedProduct.name==="" || selectedProduct.price==="" )
     {
      setMessageBoard({title:"No Product Detected! ",message:"please search a product in search bar!",state:true})
      return true;
     }
    return false;

  }


  

  return (
    <div className='flex flex-col justify-center items-center h-full items-center'>
         {messageBoard.state && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40"></div> 
          <div className="absolute left-[40%] top-[40%] z-50">
            <MessageBoard messageBoard={messageBoard} setMessageBoard={setMessageBoard} />
          </div>
        </>
      )}
      <EditProducts isNoObjectSelected={isNoObjectSelected} productList={productList} setMessageBoard={setMessageBoard} />
      
       <InActiveProducts isNoObjectSelected={isNoObjectSelected} productList={productList.filter(product => !product.is_active)} setMessageBoard={setMessageBoard}/>
      
    </div>
  )
}

export default ManageProducts
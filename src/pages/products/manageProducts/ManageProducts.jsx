import React, { useEffect,useState } from 'react'
import Search from '../../../components/Search'
import axios from 'axios';
import { API_URL } from '../../../config';
import MessageBoard from '../MessageBoard';

const ManageProducts = () => {
  const [productList,setProductList]=useState([]);
  const [selectedProduct,setSelectedProduct]=useState({name:"",price:""});
  const [messageBoard,setMessageBoard]=useState({message:"",title:"",state:false});
  const [isLoaderOn,setIsLoaderOn]=useState(false);
  const [isRemoveLoaderOn,setIsRemoveLoaderOn]=useState(false);


  
  useEffect(()=>{
      
    axios.post(`${API_URL}/api/get`,{tableName:'products'})
    .then(res=>{
      setProductList(res.data)

    })
    .catch(err=>console.log(err));

  },[selectedProduct])

  // useEffect(()=>{
  //   if(selectedProduct==="")
  //   {
  //     setSelectedProduct({});
  //   }else
  //   {
  //   const selectedP=productList.find(item=>item.pname===selectedProduct)
  //   setSelectedProduct(selectedP);
  //   }
  // },[selectedProduct])

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setSelectedProduct({...selectedProduct,[name]:value});

  }

  const handleRemove=()=>{
    setIsRemoveLoaderOn(true);
    if(isNoObjectSelected())
    {
      
      setIsRemoveLoaderOn(false);
      return;
    }
      
    


    axios.post(`${API_URL}/api/removeProduct`,{productId:selectedProduct.id})
    .then(result=>{
      setMessageBoard({title:"Successfull!",message:result.data,state:true})
      setIsRemoveLoaderOn(false);
      setSelectedProduct({name:"",price:""})

    })
    .catch(err=>{
      setMessageBoard({title:"Error!",message:err.response.data,state:true})
      setIsRemoveLoaderOn(false);
    })



  }
  const handleSubmit=()=>{
    
    setIsLoaderOn(true);
    if(isNoObjectSelected())
    {
      setIsLoaderOn(false);
      return;
    }
    console.log(selectedProduct)

    
    axios.post(`${API_URL}/api/changePrice`,{product:selectedProduct})
    .then(res=>{
      console.log("updated") 
      setIsLoaderOn(false)
      setSelectedProduct({name:"",price:""})
    })
    .catch(err=>{
      setMessageBoard({title:"Error!",message:err.response.data,state:true})
      
      setIsLoaderOn(false);
    })
    
  }

  const isNoObjectSelected=()=>{
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
      <div className='p-2 font-bold'>Edit Price</div>
      
        <div className='bg-white shadow-xl md:w-[70%] p-4 flex flex-col gap-5'>
        <div className='flex justify-between items-center m-1'>
          <div className='flex justify-center items-center'>
          <span className='font-medium m-1'>Search:</span>
        <Search data={productList} setSelectedItem={setSelectedProduct} selectedItem={selectedProduct} searchAttribute={'name'} />
        </div>
        <div>
            <button className='btn btn-error text-white min-w-[15%]' onClick={handleRemove}>
              {isRemoveLoaderOn?<div className='loading loading-spinner'></div>:<span>Remove</span>}</button>
        </div>
        </div>
        

        <div className='md:flex'>
          <div>
            <span className='font-medium'>Product Name:</span>
            <input type='text' className='p-1 border w-60' value={selectedProduct.name||""} name='name' onChange={handleChange} disabled></input>
          </div>
          <div>
            <span className='font-medium'>Price</span>
            <input type='text'value={selectedProduct.price||""} className="p-1 border" name='price' onChange={handleChange}></input> 
          </div>
        </div>
        <div className='flex justify-center'>
        <button className='btn btn-success text-white min-w-[20%]' type='button' onClick={handleSubmit} >
          {isLoaderOn?<div className='loading loading-spinner'></div>:<span>Change</span>}</button>
        </div>

        </div>
       
      
    </div>
  )
}

export default ManageProducts
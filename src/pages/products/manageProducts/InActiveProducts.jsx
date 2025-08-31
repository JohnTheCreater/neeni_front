import React, { useState } from "react";
import Search from "../../../components/Search";
import axios from "axios";
import { API_URL } from "../../../config";
import api from "../../../api/api";

const InActiveProducts = ({ isNoObjectSelected, setMessageBoard }) => {

  const [isLoaderOn, setIsLoaderOn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ name: "", price: "" });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });

  }

  const onSearchChange = async(value)=>{
    try
    {
      const result = await api.get(`api/product/inActive?value=${value}`);
      return result.data || [];
    }
    catch(err)
    {
      console.log(err);
      return [];
    }
  }



  const handleSubmit = () => {

    setIsLoaderOn(true);
    if (isNoObjectSelected(selectedProduct)) {
      setIsLoaderOn(false);
      return;
    }

    api.post(`/api/product/activate`, { inActiveProductId: selectedProduct.id })
      .then(result => {
        console.log(result)
        setMessageBoard({ title: "Successfull!", message: result.data.message, state: true })

        setSelectedProduct({ name: "", price: "" })
        setIsLoaderOn(false);

      })
      .catch(err => {
        console.log(err)
        setMessageBoard({ title: "Error!", message: err.response.data.message, state: true })
        setIsLoaderOn(false);

      })


  }



  return <>
    <div className='p-2 font-bold'>Activate Product</div>

    <div className='bg-white shadow-xl md:w-[70%] p-4 flex flex-col gap-5'>
      <div className='flex justify-between items-center m-1'>
        <div className='flex justify-center items-center'>
          <span className='font-medium m-1'>Search:</span>
          <Search onChange={onSearchChange} setSelectedItem={setSelectedProduct} selectedItem={selectedProduct} searchAttribute={'name'} />
        </div>

      </div>


      <div className=' w-full'>
        <div className="flex w-full justify-between m-2">
          <span className='font-medium w-1/2'>Product Name:</span>
          <input type='text' className='p-1 border md:w-[100%]' value={selectedProduct.name || ""} name='name' onChange={handleChange} disabled></input>
        </div>
        <div className="flex w-full justify-between m-2">
          <span className='font-medium w-1/2'>Price:</span>
          <input type='text' value={selectedProduct.price || ""} className="p-1 border md:w-[100%]" name='price' onChange={handleChange}></input>
        </div>
      </div>
      <div className='flex justify-center'>
        <button className='btn btn-success text-white min-w-[20%]' type='button' onClick={handleSubmit} >
          {isLoaderOn ? <div className='loading loading-spinner'></div> : <span>Activate</span>}</button>
      </div>

    </div>

  </>
}

export default InActiveProducts;
import React, { useState } from "react";
import Search from "../../../components/Search";
import axios from "axios";
import { API_URL } from "../../../config";
import api from "../../../api/api";

const EditProducts = ({ isNoObjectSelected, productList = [], setMessageBoard }) => {

  const [isLoaderOn, setIsLoaderOn] = useState(false);
  const [isRemoveLoaderOn, setIsRemoveLoaderOn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ name: "", price: "" });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });

  }

  const handleRemove = () => {
    setIsRemoveLoaderOn(true);
    if (isNoObjectSelected(selectedProduct)) {
      setMessageBoard({ title: "Error!", message: "Please select a product to delete", state: true })
      setIsRemoveLoaderOn(false);
      return;
    }






    api.delete(`/api/product/${selectedProduct.id}`)
      .then(result => {
        console.log(result)
        setMessageBoard({ title: "Successfull!", message: result.data.message, state: true })
        setIsRemoveLoaderOn(false);
        setSelectedProduct({ name: "", price: "" })

      })
      .catch(err => {
        setMessageBoard({ title: "Error!", message: err.response?.data?.message || err.message || "Failed to delete product", state: true })
        setIsRemoveLoaderOn(false);
      })

  }

  const handleSubmit = () => {

    setIsLoaderOn(true);
    if (isNoObjectSelected(selectedProduct)) {
      setMessageBoard({ title: "Error!", message: "Please select a product to edit", state: true })
      setIsLoaderOn(false);
      return;
    }
    console.log(selectedProduct)


    api.put(`/api/product/${selectedProduct.id}`, { price: selectedProduct.price })
      .then(res => {
        setMessageBoard({ title: "Success!", message: "Product price updated successfully", state: true })
        setIsLoaderOn(false)
        setSelectedProduct({ name: "", price: "" })
      })
      .catch(err => {
        setMessageBoard({ title: "Error!", message: err.response?.data?.message || err.message || "Failed to update product price", state: true })
        setIsLoaderOn(false);
      })

  }



  return <>
    <div className='p-2 font-bold'>Edit Price</div>

    <div className='bg-white shadow-xl md:w-[70%] p-4 flex flex-col gap-5'>
      <div className='flex md:flex-col items-center w-[100%] items-center m-1'>
        <div className='flex justify-center items-center'>
          <span className='font-medium m-1'>Search:</span>
          <Search data={productList} setSelectedItem={setSelectedProduct} selectedItem={selectedProduct} searchAttribute={'name'} />
        </div>
        <div className="w-full flex justify-center m-2">
          <button className='btn btn-error text-white min-w-[15%]' onClick={handleRemove}>
            {isRemoveLoaderOn ? <div className='loading loading-spinner'></div> : <span>Delete</span>}</button>

        </div>
      </div>


      <div className='w-full'>
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
          {isLoaderOn ? <div className='loading loading-spinner'></div> : <span>Change</span>}</button>
      </div>

    </div>

  </>
}

export default EditProducts;
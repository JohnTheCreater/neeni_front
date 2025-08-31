import React, { useEffect, useState } from 'react';
import Drop from "../../../components/Drop";
import Search from "../../../components/Search";
import { FaPlus, FaMinus } from "react-icons/fa6";
import api from '../../../api/api';

export const Purchase = ({ purchaseList, setPurchaseList, error, setError, productList }) => {



  //add purchase
  const handlePurchaseAdd = () => {
    const lastProduct = purchaseList[purchaseList.length - 1];
    if (lastProduct && lastProduct.name !== '' && lastProduct.sub_total !== "" && lastProduct.sub_total > 0) {
      setPurchaseList([...purchaseList, { id: purchaseList.length + 1, name: "", sub_total: 0,paid_status:"unpaid" }]);
      setError("");
    } else {
      setError("Please Fill the fields!");
    }
  };

  //remove purchase
  const handleRemove = (index) => {
    const modifiedPurchaseList = purchaseList.filter((item, i) => i !== index);
    setPurchaseList(modifiedPurchaseList);
  };


  //update purchase list
  const handlePurchaseChange = (index, updatedProduct, type) => {
    let updatedItem = type  ? 
      { ...updatedProduct, quantity: 1, sub_total: updatedProduct.price,pid:updatedProduct.id,paid_status:"unpaid" } :
      { ...updatedProduct };

    const updatedPurchaseList = purchaseList.map((product, i) =>
      i === index ? updatedItem : product
    );
    setPurchaseList(updatedPurchaseList);
  };

   const onSearchChange = async (value)=>{
    try{
    const result = await api.get(`api/product/active?value=${value}`)
    return result.data;
    }
    catch(err)
    {
      console.log(err);
      return [];
    }
 
  }

  return (
    <>
      {purchaseList?.map((item, index) => (
        <PurchaseItem
          key={index}
          index={index}
          product={item}
          productList={productList}
          handleRemove={handleRemove}
          handlePurchaseAdd={handlePurchaseAdd}
          onProductChange={handlePurchaseChange}
          onSearchChange = {onSearchChange}
          purchaseListLength={purchaseList?.length}
          setError={setError}
        />
      ))}
      {error && (
        <div className="relative">
          <p className="absolute top-[50%] left-[50%] font-medium text-xl text-error">{error}</p>
        </div>
      )}
    </>
  );
};

const PurchaseItem = ({
  index,
  product,
 onSearchChange,
  handleRemove,
  handlePurchaseAdd,
  onProductChange,
  purchaseListLength,
  setError
}) => {

  useEffect(() => {
    onProductChange(index, { ...product, paid_status: product.paid_status }, false);
  }, [product.paid_status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedProduct = {
      ...product,
      [name]: Number(value) === 0 ? '' : Number(value),
      sub_total: Number(name === "quantity" ? value * product.price : value * product.quantity).toFixed(2),
    };
    onProductChange(index, updatedProduct, false);
    setError("");
  };

  

   

  return (
    <div className="flex m-3 justify-center items-center">
      <div className="flex w-full justify-between p-2 bg-white">
        <div>
          <p className="font-medium flex justify-center">Product</p>
          <Search
            onChange={onSearchChange}
            setSelectedItem={(updatedProduct, type = true) => onProductChange(index, updatedProduct, type)}
            selectedItem={product}
            searchAttribute={"name"}
         
          />
        </div>
        <div>
          <p className="font-medium flex justify-center">Price</p>
          <input
            className="p-1 border"
            type="number"
            onChange={handleChange}
            value={product.price ?? ''}
            name="price"
          />
        </div>
        <div>
          <p className="font-medium flex justify-center">Quantity</p>
          <input
            className="p-1 border"
            type="number"
            onChange={handleChange}
            name="quantity"
            value={product.quantity ?? ''}
          />
        </div>
        <div>
          <p className="font-medium flex justify-center">Paid Status</p>
          <Drop option={product?.paid_status} setOption={(status) => onProductChange(index, { ...product, paid_status: status }, false)} list={['paid', 'unpaid']} />
        </div>
        <div>
          <p className="font-medium flex justify-center">Subtotal</p>
          <input className="p-1 border" type="text" value={product.sub_total ?? ''} disabled />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {purchaseListLength > 1 && (
          <button className="btn btn-error text-white" onClick={() => handleRemove(index)}><FaMinus /></button>
        )}
        {index === purchaseListLength - 1 && (
          <button className="btn btn-success text-white" onClick={handlePurchaseAdd}><FaPlus /></button>
        )}
      </div>
    </div>
  );
};

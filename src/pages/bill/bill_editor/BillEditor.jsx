import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import LayOut from "../../../components/LayOut/LayOut";
import axios from "axios";
import { API_URL } from "../../../config";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerDetails from "./CustomerDetails";
import Info from "./Info";
import { Purchase } from "./Purchase";
import api from "../../../api/api";

const BillEditor = () => {




  const location = useLocation();
  const navigate = useNavigate();


  if (location.state === null) {
    return <p>Access Denied!</p>
  }

  const mode = location.state.mode || 'add';


  const [customer, setCustomer] = useState( {});
  const [customerList, setCustomerList] = useState([])
  const [total, setTotal] = useState(0);
  const [billNumber, setBillNumber] = useState(mode == 'edit' ? location.state.billNumber : null);
  const [date, setDate] = useState(new Date());
  const [paidAmount, setPaidAmount] = useState(0);
  const [paidAmountLock, setPaidAmountLock] = useState(false);
  const [shopList, setShopList] = useState([]);
  const [shop, setShop] = useState();
  const [error, setError] = useState("");
  const [productList, setProductList] = useState([]);
  const [purchaseList, setPurchaseList] = useState([{}]);


  const [isSubmitLoaderOn, setIsSubmitLoaderOn] = useState(false)
  const [isRemoveLoaderOn, setIsRemoveLoaderOn] = useState(false)


 useEffect(() => {
  api.get('/api/core/shops')
    .then(res => {
      setShopList(res.data);
    })
    .catch(err => console.log(err));
}, []);



useEffect(() => {
  if (shopList.length > 0) {
    startEditor();
  }
}, [shopList]);


  const startEditor = ()=>{
     if (location.state.mode === "edit") {

        retriveOldBill()
    }
    else{

       setNewEditor();
       setShop(shopList[0])
    }
  }

 

  const retriveOldBill = () => {

      setMetaInfo();
      setSalesInfo();


  }
  const setMetaInfo = () =>{

   
  console.log("bill number " , billNumber,mode)
                //billNumber
    api.get(`api/bill/${billNumber}`)
    .then(res=>{
      const result = res.data;
      const shop = shopList.find(sh => sh.id === result.shopid);
      setShop(shop);
      setDate(new Date(result.date));
      setCustomer({name:result.name,id:result.customer_id,address:result.address,mobileno:result.mobileno,is_active:result.is_active});

      console.log(result)
    })
  }


  const setSalesInfo = () => {

              //billNumber
    api.get(`api/sales/${billNumber}`)
    .then(res=>{
      console.log(res);
      const sales = res.data;
      setPurchaseList(sales);
    })

  }

  const setNewEditor = () =>{

       api.get(`/api/bill/getNextBillNumber`)
        .then(res => {
          const lastBillNumber = Number(res.data);
          if (isNaN(lastBillNumber)) { throw new Error('Bill Number Calculation : Not an Number!') }
          setBillNumber(lastBillNumber);

        })
        .catch(err => console.log(err))
  }













  //handle submit
  const handleSubmit = (e) => {

    e.preventDefault();
    setIsSubmitLoaderOn(true)

    if (shop.name === '') {
      setError("select shop!")
      setIsSubmitLoaderOn(false)
      return;
    }
    else {
      setError("");
    }

    if (Object.keys(customer).length > 0) {

      const prod = purchaseList.find((purchase) => !purchase.pid || !purchase.sub_total || !purchase.name || !purchase.quantity || purchase.name === "" || purchase.quantity === "")
      console.log(purchaseList)
      console.log(prod , !prod , purchaseList.length)
      if (purchaseList.length > 0 && !prod) {

        setError("")
       
        if (mode === 'add') {

                                //billNumber,customerId, purchaseList, shopId, date, paidAmount, billAmount
          api.post(`/api/bill`, {billNumber, customerId: customer.id, purchaseList, shopId: shop.id, date, paidAmount: (paidAmount ? paidAmount : 0), billAmount: total })
            .then(res => {
              console.log("Bill created successfully:", res.data);
              console.log("bill added")
              navigate('/bill')

            })
            .catch(err => setError(err.response.data.message))
            .finally(() => setIsSubmitLoaderOn(false))
        }
        else if (mode === 'edit') {
          //path : billNumber  body :   customerId, purchaseList, shopId, date, paidAmount, billAmount
          api.put(`/api/bill/${billNumber}`, { customerId: customer.id, purchaseList, shopId: shop.id, date, paidAmount: (paidAmount ? paidAmount : 0), billAmount: total })
            .then(res => {
              console.log("bill Edited!")
            
              navigate('/bill')

            })
            .catch(err => setError(err.response.data.message))
            .finally(() => setIsSubmitLoaderOn(false))
        }

      }
      else {
        setError("Enter product details !")
        setIsSubmitLoaderOn(false)
      }
    }
    else {
      setError("Enter customer Info!")
      setIsSubmitLoaderOn(false)
    }
  };

  const handlePaidAmountChange = (e) => {
    setPaidAmount(Number(e.target.value));
  }





  


 



  useEffect(() => {

    let unpaidPurchase = purchaseList.find((purchase) => purchase.paid_status === "unpaid");

    setPaidAmountLock(!unpaidPurchase);

  }, [purchaseList])


  useEffect(() => {

    const totalAmount = purchaseList.reduce((acc, item) => acc + Number(item.sub_total ? item.sub_total : 0), 0)
    setTotal(Number(totalAmount).toFixed(2));

  }, [purchaseList, productList, mode])



  const handleBillRemove = () => {

    setIsRemoveLoaderOn(true)
    //path : billNumber
    axios.delete(`/api/bill/${billNumber}`)
      .then(res => {

        alert("bill deleted!")
        navigate('/bill')
      })
      .catch(err => setError(err.response.data.message))
      .finally(() => setIsRemoveLoaderOn(false))

  }









  return (
    <LayOut>
      <div className="flex flex-col m-10     justify-center items-center">


        {mode === "edit" && <div className="w-[77%] flex items-end justify-end"><button className="btn btn-error rounded-b-none text-white" onClick={handleBillRemove}>{isRemoveLoaderOn ? <div className="loading loading-spinner"></div> : <span>Remove</span>}</button></div>}
        <div className="w-[80%] p-2 bg-white rounded-lg m-10 mt-0 flex flex-col items-center justify-center">
          <Info billNumber={billNumber} setDate={setDate} date={date} shop={shop} setShop={setShop} shopList={shopList || []} />
          <CustomerDetails customerList={customerList} setCustomer={setCustomer} customer={customer} />
          <div className=" w-full bg-white">
            <Purchase purchaseList={purchaseList} productList={productList} setPurchaseList={setPurchaseList} error={error} setError={setError} />

            <div className="flex justify-between m-2 w-[100%] items-center">
              <div>
                <lable className="font-medium"> Paid Amount: </lable><input disabled={paidAmountLock} type="number" onChange={(e) => handlePaidAmountChange(e)} value={paidAmount} className="p-1 border" />
              </div>
              <div>
                <button type="button" onClick={handleSubmit} className="btn btn-success text-white">{isSubmitLoaderOn ? <div className="loading loading-spinner"></div> : <span>Submit</span>}</button>
              </div>

              <div>

                <span className="font-medium">Total:  </span>
                <input className="p-1 border text-center bg-red-200 border-red-300 m-2" disabled value={total}></input>
              </div>

            </div>

          </div>

        </div>
      </div>
    </LayOut>
  );
};





export default BillEditor;




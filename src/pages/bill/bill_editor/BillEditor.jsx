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

  const mode = location.state.mode;


  const [customer, setCustomer] = useState(location.state.customer || {});
  const [customerList, setCustomerList] = useState(location.state.customerList || [])
  const [total, setTotal] = useState(0);
  const [billNumber, setBillNumber] = useState(location?.state?.billNumber || 1);
  const [date, setDate] = useState(new Date(location.state.date));
  const [paidAmount, setPaidAmount] = useState(location?.state?.paid_amount);
  const [paidAmountLock, setPaidAmountLock] = useState(false);
  const [shopList, setShopList] = useState(location.state.shopList || []);
  const [shop, setShop] = useState(location.state.shop || shopList[0]);
  const [error, setError] = useState("");
  const [productList, setProductList] = useState([]);
  const [purchaseList, setPurchaseList] = useState([{}]);

  const [initialRender, setInitialRender] = useState(true);

  const [isSubmitLoaderOn, setIsSubmitLoaderOn] = useState(false)
  const [isRemoveLoaderOn, setIsRemoveLoaderOn] = useState(false)



  useEffect(() => {

    if (location.state.mode === "add") {


      api.get(`/api/bill/getNextBillNumber`)
        .then(res => {
          const lastBillNumber = Number(res.data);
          if (isNaN(lastBillNumber)) { throw new Error('Bill Number Calculation : Not an Number!') }
          setBillNumber(lastBillNumber);

        })
        .catch(err => console.log(err))

        

    }


  }, [])












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
      const prod = purchaseList.find((purchase) => purchase.name === "" || purchase.quantity === "")
      if (purchaseList.length > 0 && !prod) {

        setError("")
        console.log("list", shop)
        if (mode === 'add') {
          console.log("Submitting bill with number:", billNumber);
          console.log("Bill data:", {billNumber, customerId: customer.id, purchaseList, shopId: shop.id, date, paidAmount: (paidAmount ? paidAmount : 0), billAmount: total });
          
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
    setPaidAmount(e.target.value);
  }





  useEffect(() => {
    api.get(`/api/product`)
      .then(res => {
        console.log(res.data);
        setProductList(res.data)
      })
      .catch(err => console.log(err));

  }, [])


  useEffect(() => {
    if (mode === "edit") {
      api.get(`/api/sales/${billNumber}`)
        .then(res => {
          const data = res.data;


          const updatedPurchaseList = data.map(item => {
            // console.log("pro",item)
            const productName = productList.find(prod => prod.id === item.pid)?.name || "unknown";
            const price = Number(item.price)
            const sub_total = Number(item.sub_total)
            console.log("prod id ", item.pid)
            return {
              ...item,
              name: productName,
              price: price,
              sub_total: sub_total


            };
          });

          console.log()
          if (updatedPurchaseList.length > 0) {
            setPurchaseList(updatedPurchaseList);
          }
        })
        .catch(err => console.log(err))
    }

  }, [billNumber, productList, mode])


  // useEffect(()=>{

  // },[productList,mode,billNumber])

  useEffect(() => {

    let unpaidPurchase = purchaseList.find((purchase) => purchase.paid_status === "unpaid");

    setPaidAmountLock(!unpaidPurchase);


    setInitialRender(false);


  }, [purchaseList])

  //calculate total
  useEffect(() => {

    const totalAmount = purchaseList.reduce((acc, item) => acc + Number(item.sub_total), 0)
    setTotal(Number(totalAmount).toFixed(2));

  }, [purchaseList, productList, mode])

  const handleBillRemove = () => {
    setIsRemoveLoaderOn(true)
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
                <input className="p-1 border text-center bg-red-200 border-red-300 m-2" value={total}></input>
              </div>

            </div>

          </div>

        </div>
      </div>
    </LayOut>
  );
};





export default BillEditor;




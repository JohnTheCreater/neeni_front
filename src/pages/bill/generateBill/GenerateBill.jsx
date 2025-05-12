  import React, { useEffect, useState } from "react";
  import "react-calendar/dist/Calendar.css";
  import LayOut from "../../../components/LayOut/LayOut";
  import axios from "axios";
  import { API_URL } from "../../../config";
  import { useLocation, useNavigate } from "react-router-dom";
  import CustomerDetails from "./CustomerDetails";
  import Info from "./Info";
  import { Purchase } from "./Purchase";

  const GenerateBill = () => {

   
  

    const location=useLocation();
    const navigate =useNavigate();

    if(location.state===null)
      {
        return <p>Access Denied!</p>
      }

    const [user, setUser] = useState(location.state.user||{});
    const [userList,setUserList]=useState(location.state.userList||[])
    const [total, setTotal] = useState(0);
    const [mode,setMode]=useState(location.state.mode||"");
    const [billNumber, setBillNumber] = useState(location?.state?.billNumber || 1);
    const [date, setDate] = useState(new Date(location.state.date));
    const [selectedName, setSelectedName] = useState(location.state.user?.name||"");
    const [paidAmount,setPaidAmount] = useState(location?.state?.paidAmount );
    const [paidAmountLock,setPaidAmountLock] = useState(false);
    const [shopList,setShopList] = useState(location.state.shopList||[]);
    const [shop,setShop]=useState(location.state.shop||shopList[0]);
    const [error, setError] = useState("");
    const [productList,setProductList]=useState([]);
    const [purchaseList, setPurchaseList] = useState([{}]);

    const [initialRender,setInitialRender]=useState(true);

    const[isSubmitLoaderOn,setIsSubmitLoaderOn]=useState(false)
    const[isRemoveLoaderOn,setIsRemoveLoaderOn]=useState(false)

 

    useEffect(()=>{


      if(location.state.mode==="add")
      {
        
        axios.get(`${API_URL}/api/getLastBillNumber`)
        .then(res=>{
        
          console.log("hihi",res.data)
          console.log("id",res.data[0].id);
          setBillNumber(res.data.length==1?res.data[0]?.id+1:1)
      })
      .catch(err=> console.log(err))

      }


    },[])





  

      


      

    //handle submit
    const handleSubmit = (e) => {
      e.preventDefault();
      setIsSubmitLoaderOn(true)
      
      if(shop.name==='')
      {
        setError("select shop!")
        setIsSubmitLoaderOn(false)
        return;
      }
      else
      {
        setError("");
      }
      
      if(Object.keys(user).length > 0)
      {
        const prod = purchaseList.find((purchase)=>purchase.name === "" || purchase.quantity==="")
        if(purchaseList.length > 0  && !prod )
        {
          
          setError("")
          console.log("list",purchaseList)
        axios.post(`${API_URL}/api/addBill`,{user,purchaseList,shop,date,billNumber,mode,paidAmount:(paidAmount?paidAmount:0),bill_amount:total})
        .then(res=>{
          console.log("bill added")
          setPurchaseList([])
          setUser({})
          setDate(new Date())
          setShop({})
          setSelectedName("")
          navigate('/bill')
          
        })
        .catch(err=>setError(err.response.data))
        .finally(()=>setIsSubmitLoaderOn(false))

        }
        else{
          setError("Enter product details !")
          setIsSubmitLoaderOn(false)
        } 
      }
      else{
        setError("Enter customer Info!")
        setIsSubmitLoaderOn(false)
      }
    };

    const handlePaidAmountChange = (e)=>
    {
      setPaidAmount(e.target.value);
    }

  


    
    useEffect(()=>{
      axios.post(`${API_URL}/api/get`,{tableName:'products'})
      .then(res=>{
        setProductList(res.data)
      })
      .catch(err=>console.log(err));

    },[])


    useEffect(()=>{
      if(mode==="edit")
      {
        console.log("total ams: ",location.state.paidAmount)
        axios.post(`${API_URL}/api/getSales`,{billNo:billNumber})
          .then(res=>{
            console.log("Response data:", res.data); // Log the response data

            const updatedPurchaseList = res.data.map(item => {
              // console.log("pro",item)
              const productName = productList.find(prod => prod.id === item.pid)?.name||"unknown";
              const price=Number(item.price)
              const sub_total=Number(item.sub_total)
              console.log("prod id ",item.pid)  
              return {
                  ...item, 
                  name: productName,
                  price:price,
                  sub_total:sub_total
                
                  
              };
          });
          
          console.log()
          if(updatedPurchaseList.length>0)
          {
            setPurchaseList(updatedPurchaseList);
          }
          })
          .catch(err=>console.log(err))
      }

    },[billNumber,productList,mode])


    // useEffect(()=>{

    // },[productList,mode,billNumber])

    useEffect(()=>{
      
      let unpaidPurchase=purchaseList.find((purchase)=>purchase.paidStatus==="unpaid");

      setPaidAmountLock(!unpaidPurchase);
     

     setInitialRender(false);
      

    },[purchaseList])

      //calculate total
      useEffect(()=>{
        
        const totalAmount = purchaseList.reduce((acc,item)=>acc+Number(item.sub_total),0)
        setTotal(Number(totalAmount).toFixed(2));

      },[purchaseList,productList,mode])

      const handleBillRemove=()=>{
        setIsRemoveLoaderOn(true)
        axios.post(`${API_URL}/api/removeBill`,{billNumber:billNumber,shop:shop})
        .then(res=>{
          alert("bill deleted!")
          navigate('/bill')
        })
        .catch(err=>setError(err.response.data))
        .finally(()=>setIsRemoveLoaderOn(false))

      }

    



    



    return (
      <LayOut>
      <div className="flex flex-col m-10     justify-center items-center">
      

        {mode==="edit"&& <div className="w-[77%] flex items-end justify-end"><button className="btn btn-error rounded-b-none text-white" onClick={handleBillRemove}>{isRemoveLoaderOn?<div className="loading loading-spinner"></div>:<span>Remove</span>}</button></div>}
        <div className="w-[80%] p-2 bg-white rounded-lg m-10 mt-0 flex flex-col items-center justify-center">
          <Info billNumber={billNumber} setDate={setDate} date={date} shop={shop} setShop={setShop} shopList={shopList ||[]}/>
        <CustomerDetails  userList={userList} setUser={setUser} user={user}  />
        <div className=" w-full bg-white">
        <Purchase  purchaseList={purchaseList} productList={productList}  setPurchaseList={setPurchaseList} error={error} setError={setError}/>

        <div className="flex justify-between m-2 w-[100%] items-center">
        <div>      
          <lable className="font-medium"> Paid Amount: </lable><input disabled={paidAmountLock} type="number" onChange={(e)=>handlePaidAmountChange(e)} value={paidAmount} className="p-1 border"/>
        </div>
        <div>
          <button type="button" onClick={handleSubmit} className="btn btn-success text-white">{isSubmitLoaderOn?<div className="loading loading-spinner"></div>:<span>Submit</span>}</button>
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

  



  export default GenerateBill;



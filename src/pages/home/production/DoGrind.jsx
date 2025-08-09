import  { useEffect, useState } from "react";
import Calendar from "react-calendar";
import Drop from "../../../components/Drop";
import dayjs from 'dayjs'
import api from "../../../api/api";

import { MdOutlineClose } from "react-icons/md";


const DoGrind = ({ setIsDoGrind, coreProducts, setIsError}) => {

  const [selectedCoreProduct, setSelectedCoreProduct] = useState(coreProducts[0]);
  const [grindData, setGrindData] = useState({});
  const [date, setDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isSubmitLoaderOn,setIsSubmitLoaderOn]=useState(false)


  useEffect(() => {
    setIsCalendarOpen(false)

  }, [date])

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value !== 0) {
      setGrindData({ ...grindData, [name]: value });
    }
  };

  useEffect(() => {

    setGrindData(prevGrindData => ({ ...prevGrindData, cpid: selectedCoreProduct.id, date: date }));

  }, [selectedCoreProduct, date]);



  const handleSubmit = () => {

    setIsSubmitLoaderOn(true)
    if (grindData.used && grindData.grind && grindData.producedCake && grindData.producedOil) {
      console.log(grindData);
      api
        .post(`/api/production/doGrind`, {
          grindData: grindData,
        })
        .then((result) => {
          
          setIsDoGrind(false);
          setIsSubmitLoaderOn(false);
          
        })
        .catch(err => setIsError({ message: err.response.data.message, value: true }))
        .finally(()=>setIsSubmitLoaderOn(false))

    }
    else
    {
      setIsError({ message: "please fill all the details!", value: true })
    setIsSubmitLoaderOn(false)
    }



  }

  return (
    <div className="min-w-full md:min-w-[20rem] rounded-[.4rem] border border-gray-600 p-4 min-h-[10rem] bg-white">
      <div className="md:flex justify-between ">
        <Drop
          list={coreProducts}
          setOption={setSelectedCoreProduct}
          attribute={'name'}
          option={selectedCoreProduct}
        />


        <div className="min-w-full mb-1 max-w-full md:min-w-[25%]  md:max-w-[25%] items-center flex justify-between">
          <div className="font-bold">used</div>
          <input
            name="used"
            type="number"
            className="max-w-20 p-1 border border-gray-200 rounded-[.2rem]"
            onChange={handleChange}
          ></input>

        </div>
        {selectedCoreProduct.id === 1 && <div className="min-w-full mb-1 max-w-full md:min-w-[25%]  md:max-w-[45%] p-1 gap-1 items-center flex justify-between">
          <div className="font-bold">karupatti</div>
          <input
            name="karupatti"
            type="number"
            className="max-w-20 p-1 border border-gray-200 rounded-[.2rem]"
            onChange={handleChange}
          ></input>

        </div>}

        <div className="min-w-full max-w-full md:min-w-[18%] items-center flex justify-between">
          <div className="font-bold">grind</div>
          <input
            name="grind"
            type="number"
            onChange={handleChange}
            className="max-w-20 md:max-w-10 p-1 border border-gray-200 rounded-[.2rem]"
          ></input>

        </div>
      </div>
      <div className="md:flex mt-5 justify-between w-full">
        {" "}
        <div>
          <div className="flex justify-between items-center min-w-[43%] m-1">
            <div className="font-bold mr-5">produced oil</div>
            <div>
              <input
                onChange={handleChange}
                name="producedOil"
                type="number"
                className="max-w-10 p-1 border border-gray-200 rounded-[.2rem]"
              ></input>
              <span className="font-bold p-1">ltr</span>
            </div>
          </div>
          <div className="flex justify-between items-center min-w-[43%] m-1">
            <div className="font-bold mr-5">produced cake</div>
            <div>
              <input
                onChange={handleChange}
                name="producedCake"
                type="number"
                className="max-w-10 p-1 border border-gray-200 rounded-[.2rem]"
              ></input>
              <span className="font-bold p-1">kg</span>
            </div>
          </div>

        </div>
        <div className="flex items-center">
          <button className="btn m-1" onClick={() => setIsCalendarOpen(true)}>{dayjs(date).format("DD-MM-YYYY")}</button>
          {isCalendarOpen && <div className="absolute">
            {" "}
            <Calendar onChange={setDate} value={date} />
          </div>}
        </div>
        <div className="flex justify-between items-center min-w-[30%]">
          <button
            className="btn bg-red-500 text-white hover:bg-red-600"
            onClick={() => setIsDoGrind(false)}
          >
            {" "}
            <MdOutlineClose />
          </button>
          <button className="btn btn-success text-white" onClick={handleSubmit}>{isSubmitLoaderOn?<div className="loading loading-spinner"></div>:<span>Submit</span>}</button>
        </div>
      </div>
    </div>
  );
};


export default DoGrind
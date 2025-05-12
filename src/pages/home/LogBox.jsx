import axios from "axios";
import Drop from "../../components/Drop";
import React ,{useEffect, useState} from 'react';
import { API_URL } from "../../config";
import { GiConsoleController } from "react-icons/gi";

const LogBox = ({handleUndo,constructLogList}) => {
    
    const startYear = 2023;
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index);
    const [month,setMonth] = useState(new Date().toLocaleString('en-US',{month:'short'}));
    const [year,setYear] = useState(currentYear);

    const [logList,setLogList] = useState([]);

    useEffect(()=>{

       getLog();

    },[month,year])


    const getLog = () =>{

      console.log("get log called")
      const monthIndex = getMonthIndex(month);
      axios.get(`${API_URL}/api/getLog/${monthIndex+1}/${year}/Production`)
      .then(res => {

        const constructedLogs = constructLogList(res.data);
        setLogList(constructedLogs);
        console.log(res.data)
      })
      .catch(err => console.log(err,"dfdfawf"))
    }

    const getMonthIndex = (month) =>
    {
      return months.indexOf(month);
    }

    const getMonths = () => {
        const monthList = [...Array.from({length:12}).keys()].map(index =>{
            const date  = new Date();
            date.setMonth(index);
            return date.toLocaleString('en-US',{month:'short'});
        });
        return monthList;

    }
    useEffect(()=>{
      console.log(logList)
    },[logList])

    const months = getMonths();

    const undoOperation = (item)=>{

      handleUndo(item)
      .then(()=>getLog())
      .catch(err=> console.log(err))
      
    }
    return (
        <>
            <div className="flex justify-center gap-2  w-full min-w-[58vw]">
          <div >
            <span className="font-bold text-white">Month:</span>
            <Drop list={months} option={month} setOption={setMonth}/>
          </div>
          <div>
            <span className="font-bold text-white">Year:</span>
            <Drop list={years} option={year} setOption={setYear}/>

          </div>

        </div>
     <div className=" p-1 overflow-auto min-h-[40vh] max-h-[40vh]  md:min-w-[80%] md:max-w-[80%] bg-white rounded-[1rem]">
          {logList.length > 0 ? logList?.map((item, index) => (
            <div key={index} className="text-neutral font-bold p-1 border-b border-gray-400">
              {item.message}
              <button className="p-1 text-blue-600 font-medium" onClick={()=>undoOperation(item)}>undo</button>
            </div>
          )) : <div className="w-full h-full flex justify-center items-center font-bold text-gray-400">NO DATA!</div>}
        </div>
        </>
    )

}
export default LogBox;
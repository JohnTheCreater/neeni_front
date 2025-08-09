
import Drop from "../../../components/Drop";
import { useEffect, useState } from 'react';
import dayjs from "dayjs";
import api from "../../../api/api";
import LogType from "./LogType";

const LogBox = ({ productionProducts, coreProducts, outputs, shops, setIsDataUpdate }) => {

  const startYear = 2023;
  const getMonths = () => {
    const monthList = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(2024, i, 1); 
      monthList.push(date.toLocaleString('en-US', { month: 'short' }));
    }
    return monthList;

  }
  const months = getMonths();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index);
  const [month, setMonth] = useState(sessionStorage.getItem("month") || new Date().toLocaleString('en-US', { month: 'short' }));
  const [year, setYear] = useState(sessionStorage.getItem("year") || currentYear);
  const [logList, setLogList] = useState([]);

  useEffect(() => {

    sessionStorage.setItem("month", month);
    sessionStorage.setItem("year", year);
    getLog();

  }, [month, year])



  const getLog = () => {

    const monthIndex = getMonthIndex(month);
    if (productionProducts && productionProducts.length > 0 &&
      coreProducts && coreProducts.length > 0 &&
      outputs && outputs.length > 0 &&
      shops && shops.length > 0) {

      api.get(`/api/log/${monthIndex + 1}/${year}`)
        .then(res => {
          const constructedLogs = constructLogList(res.data);
          setLogList(constructedLogs);

        })
        .catch(err => console.log(err))

    }
    else {
      console.log("Waiting for all data to load...");
    }
  }


  const getMonthIndex = (month) => {
    return months.indexOf(month);
  }


  // useEffect(()=>{
  //   console.log(logList)
  // },[logList])



  const undoOperation = (item) => {

    handleUndo(item)
      .then(() => getLog())
      .catch(err => console.log(err))

  }


  const constructLogList = (logs = []) => {
    if (!coreProducts || !productionProducts || !outputs || !shops ||
      coreProducts.length === 0 || productionProducts.length === 0 ||
      outputs.length === 0 || shops.length === 0) {
      console.log("Data not ready yet, returning empty array");
      return [];
    }

    const newLogList = logs.map((item, index) => {
      if (item.used_raw) {
        return {
          ...item,
          message:
            `${item.used_raw} KG raw ${coreProducts[item.cpid - 1].name}
           ${item.cpid === 1 ? `, ${item.used_karupatti} KG
            ${productionProducts[3]?.name}` : ''} 
            used, ${item.grind} grinds and ${item.produced_oil} 
            ltr ${coreProducts[item.cpid - 1].name} oil,
            ${item.produced_cake} kg ${coreProducts[item.cpid - 1].name} 
            cake  produced on ${dayjs(item.date).format("DD-MM-YYYY")}! `,
          typ: LogType.GRIND, id2: index
        };
      }
      else if (item.sid) {
        return {
          ...item,
          message: `${Math.abs(item.quantity)}
           ${item.opid == 1 ? 'LTR' : 'KG'} of 
           ${coreProducts[item.cpid - 1].name}
            ${outputs[item.opid - 1].name} 
            ${Number(item.quantity) < 0 ? 'has returned to production from ' : 'had been sent to'}
             ${shops[item.sid - 1].name} on ${dayjs(item.date).format("DD-MM-YYYY")}!`,
          typ: LogType.TRANSACTION, id2: index
        }
      }
      else {

        return {
          ...item,
          message: `${parseFloat(item.quantity).toFixed(2)}
           ${item?.ppid === 1 ? 'LTR' : 'KG'} 
           ${coreProducts[item.cpid - 1].name} 
           ${productionProducts[item.ppid - 1].name} 
            added on ${dayjs(item.date).format("DD-MM-YYYY")}!`,
          typ: LogType.ADD, id2: index
        };
      }
    })

    newLogList.sort((a, b) => {
      const diff = new Date(b.date) - new Date(a.date)
      if (diff == 0)
        return b.typ - a.typ;
      return diff;
    });
    return newLogList;

  }






  const handleUndo = (item) => {

    if (window.confirm("Are you sure you want to undo this action?")) {
      return api
        .post(`/api/log/undo`, { id: item.id, type: item.typ })
        .then((result) => {

          setIsDataUpdate((prev) => prev + 1);


        })
        .catch((err) => {
          console.log('New Error:', err)
          alert("Failed to undo the action. Please try again.");
        });

    }

  };
  return (
    <div className="flex flex-col items-center min-w-full">
      <div className="flex justify-center gap-2  w-full min-w-[100%]">
        <div >
          <span className="font-bold text-white">Month:</span>
          <Drop list={months} option={month} setOption={setMonth} />
        </div>
        <div>
          <span className="font-bold text-white">Year:</span>
          <Drop list={years} option={year} setOption={setYear} />

        </div>

      </div>
      <div className=" p-1 overflow-auto md:min-w-[80%] min-h-[40vh] max-w-[500px] max-h-[250px]  bg-white rounded-[1rem]">
        {logList.length > 0 ? logList?.map((item, index) => (
          <div key={index} className="text-neutral font-bold p-1 border-b border-gray-400">
            {item.message}
            <button className="p-1 text-blue-600 font-medium" onClick={() => undoOperation(item)}>undo</button>
          </div>
        )) : <div className="w-full h-full flex justify-center items-center font-bold text-gray-400">NO DATA!</div>}
      </div>
    </div>
  )

}
export default LogBox;
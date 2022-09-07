import './App.css';
import {Routes, Route , Link }from 'react-router-dom';
import dataFromFile from "./list.json"
import { useState, useRef, useEffect } from 'react';
import {Activity, Contragent, Summary, Transaction} from './Form'

export type newData = {
  _id: string;
  amount:number;
  type:string;
  fullname:string;
  company?:string;
  email: string;
  phone:string;
  address:string;
  date:string;
  question?:string
}
    
 type Date={
  cref:React.MutableRefObject<HTMLInputElement>,
  sref:React.MutableRefObject<HTMLSelectElement>,
 }

 type Modal = {
  serverActivated:boolean
 }

  function toLocale(array:newData[]):newData[] {
    for(let i of array){
      i.date = new Date(i.date).toLocaleDateString()
      i.date = i.date.split(/\./).reverse().join('-')
      console.log(i.date)
      i.amount=Number(i.amount)}
    const sortedArray = array.sort((a,b)=>(a.date>b.date)?1:(a.date<b.date)?-1:0)
    return sortedArray
    }
  const data1:newData[] = structuredClone(dataFromFile.data)
  console.log(dataFromFile, data1)
  
  

const App=() =>{
   
    const [data, setData] = useState<newData[]>(data1)
    const [sumIncome, setSumIncome] = useState<newData[]|undefined>()
    const [sumOutcome, setSumOutcome] = useState<newData[]|undefined>()
    const [sumLoan, setSumLoan] = useState<newData[]|undefined>()
    const [sumInvest, setSumInvest] = useState<newData[]|undefined>()
  
    const [dateData, setDateData] = useState<newData[]>(structuredClone(data1))
    const [rangeAmount, setRangeAmount] = useState(false)
    const [rangeDate, setRangeDate] = useState(false)
    const [serverActivated, setServerActivated] = useState(false)
    const [info_modal,setInfo_modal] = useState(false)
    const modalRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const calRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const selectRef1 = useRef() as React.MutableRefObject<HTMLSelectElement>

    useEffect(()=> {
      const sumIncome1 = data.filter(item=>item.type === 'income')
      const sumOutcome1  = data.filter(item=>item.type === 'outcome')
      const sumLoan1  = data.filter(item=>item.type === 'loan')
      const sumInvest1 = data.filter(item=>item.type === 'investment')
      setSumIncome(sumIncome1)
      setSumOutcome(sumOutcome1)
      setSumLoan(sumLoan1)
      setSumInvest(sumInvest1)
    },[data])

    useEffect(()=> {
      const sumIncome1 = dateData.filter(item=>item.type === 'income')
      const sumOutcome1  = dateData.filter(item=>item.type === 'outcome')
      const sumLoan1  = dateData.filter(item=>item.type === 'loan')
      const sumInvest1 = dateData.filter(item=>item.type === 'investment')
      setSumIncome(sumIncome1)
      setSumOutcome(sumOutcome1)
      setSumLoan(sumLoan1)
      setSumInvest(sumInvest1)
    },[dateData])

    const Date=({cref, sref}:Date)=>{
      if(selectRef1.current&&calRef.current.value!==''){
          return(
          <h3 style={{margin:"20px 20% 0 20%"}}>Data {selectRef1.current.value} {calRef.current.value} shown</h3>
      )
      } else {return null}
    }

    const Modal =({serverActivated}:Modal)=>{
      if(!serverActivated){
        return(
          <div ref = {modalRef} className = {(!info_modal)?"modal":"modal_hidden"}>
            <div className = "alert">
              Behind you see data from local json file. <br/>
              If you want to manage your own data,
              you may "Activate server" and begin to work with them.
              <button className = "modal_btn" onClick = {hideModal}>X</button>  </div>
          </div>)
      } else {
          return( 
          <div ref = {modalRef} className = {(!info_modal)?"modal":"modal_hidden"}>
          <div className = "alert">
            At the moment database may countain data of other users. <br/>
            You may use or add them or "Clear database" and work from scratch.
            <button className = "modal_btn" onClick = {hideModal}>X</button>  </div>
        </div>)}
    }

   function hideModal(){
    setInfo_modal(true)
    }

    function getContragents() {
        fetch('https://activities-server-db.herokuapp.com/m')
        .then(response => {
          return response.text();
        })
        .then(data => {
          setInfo_modal(!info_modal)
          const id1= JSON.parse(data)
          const id = toLocale(id1)
          setData(id);
          console.log(data)
         })
      }
 
    function getTimes() {
      const date = calRef.current.value
      const sign = selectRef1.current.value
      console.log(calRef.current.value)
      if(calRef.current.value){     
        fetch('https://activities-server-db.herokuapp.com/times',  {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
            sign:sign,
            date:date}),
          })
            .then(response => {
              return response.text();
            })
            .then(data => {
              const id1= JSON.parse(data)
              const id = toLocale(id1)
              setDateData(id)
              console.log(id)
            });
            } else {
              getContragents()
            }
        }

    function startServer(){
     setServerActivated(!serverActivated)
     setInfo_modal(!info_modal)
      if(!calRef.current.value){
        getContragents()
       
      } else {
        getTimes()
      }
    }

  function clearDatabase(){
    fetch('https://activities-server-db.herokuapp.com/cleardb')
    .then(response => {
          return response.text();
        })
        .then(data => {
        
          console.log(data)
        });
    }

    function getServerData(){
      if(serverActivated){
        getContragents()
      } else {
        setData(data1)
      }
    }

    function rangeByAmount(){
      setRangeAmount(!rangeAmount)
      setRangeDate(false)
    }
    
    function rangeByDate(){
      setRangeDate(!rangeDate)
      setRangeAmount(false)
    }

    function calendarFunc(){
      let calendar;
      if (calRef.current.value){
        if(!serverActivated){
          calendar = (data.sort((a,b)=>(a.date<b.date)?1:(a.date>b.date)?-1:0).filter(item=>{
          return (selectRef1.current.value==="Before")?item.date<calRef.current.value:
                (selectRef1.current.value==="Until")?item.date<=calRef.current.value:
                (selectRef1.current.value==="For")?item.date===calRef.current.value:
                (selectRef1.current.value==="From")?item.date>=calRef.current.value:
                (selectRef1.current.value ==="After")?item.date>calRef.current.value:null
          }));
          setDateData(calendar)
        } else {
          getTimes()
        }
      } else {
        if(!serverActivated){
          setDateData(data)
        } else {
        getContragents()
        }
      }
    }
  return(
      <div className ="wrapper1"> 
        <Modal serverActivated = {serverActivated}/>
          <div className = "tablo" onClick = {getServerData}>
              <nav className = "navpanel">
                  <ul> 
                    <Link to = "/tab=5"><li>New transaction</li></Link>
                    <Link to = "/tab=0"><li>Income</li></Link>
                    <Link to = "/tab=1"><li>Outcome</li></Link>
                    <Link to = "/tab=2"><li>Loans</li></Link>
                    <Link to = "/tab=3"><li>Investments</li></Link>
                    <Link to = "/tab=4"><li>Contragents</li></Link>
                    <Link to = "/"><li>Summary</li></Link>
                </ul>
              </nav>
          </div>
          <div className="wrapper">
              <input type = "date" ref = {calRef} onInput = {calendarFunc}/>
              <select ref = {selectRef1} onChange = {calendarFunc}>
                <option>Before</option>
                <option>Until</option>
                <option>For</option>
                <option>From</option>
                <option>After</option>
              </select> 
               Range by: amount<input type = "checkbox" onChange={rangeByAmount}></input>
              date<input type = "checkbox" onChange={rangeByDate}></input>
              <ul style = {{listStyleType:"none",position : "absolute", bottom: "535px",left:"500px"}}>
                <li><input style = {{backgroundColor:"lightBlue", border: "none"}} type = 'checkbox' onChange = {startServer}></input>Activate server</li>
                <li><input type = 'checkbox' onChange = {clearDatabase}></input>Clear database</li>
              </ul>
          </div>
          <Date cref = {calRef} sref = {selectRef1}/>
          <Routes>
              <Route path = "/tab=0" element ={<Activity someactivity = {sumIncome} type = "Income" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color ="red"/>}/>
              <Route path = "/tab=1" element ={<Activity someactivity = {sumOutcome} type = "Outcome" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color ="steelBlue"/>}/>
              <Route path = "/tab=2" element ={<Activity someactivity = {sumLoan} type = "Loan" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color = "yellow"/>} />
              <Route path = "/tab=3" element ={<Activity someactivity = {sumInvest} type  = "Investment"rangeAmount = {rangeAmount} rangeDate = {rangeDate} color = "lightgreen"/>}/>
              <Route path = "/tab=4" element ={<Contragent data = {data} serverActivated = {serverActivated} 
                                                                        sumincome = {sumIncome}
                                                                        sumoutcome = {sumOutcome}
                                                                        sumloans = {sumLoan}
                                                                        suminvest = {sumInvest}/>}/>
              <Route path = "/" element ={<Summary data = {data} sumincome = {sumIncome}
                                                                 sumoutcome = {sumOutcome}
                                                                 sumloans = {sumLoan}
                                                                 suminvest = {sumInvest}/>}/>
              <Route path = "/tab=5" element ={<Transaction data={data}/>}/>
          </Routes> 
      </div>
      )
    }

  export default App;
  
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
    
 export type Date2={
  cref:React.MutableRefObject<HTMLInputElement>,
  sref:React.MutableRefObject<HTMLSelectElement>,
 }

 type Modal = {
  serverActivated:boolean,
  fileAlert:boolean
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
    
  export const Date1=({cref, sref}:Date2)=>{
    if(sref.current&&cref.current.value!==''){
        return(
        <h3 className = "date"> Data {sref.current.value} {cref.current.value} shown</h3>
    )
    } else {return null}
  }


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
    const [dateActivated, setDateActivated] = useState(false)
    const [info_modal,setInfo_modal] = useState(false)
    const [fileAlert, setFileAlert] = useState(false)
    const [firstAlert, setFirstAlert] = useState(false)
    const canvasRef = useRef() as React.MutableRefObject<HTMLDivElement>
    const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>
    const calRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const selectRef1 = useRef() as React.MutableRefObject<HTMLSelectElement>
    const amountRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const dateRef = useRef() as React.MutableRefObject<HTMLInputElement>

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

    function hideModal(){
    setInfo_modal(true)
  }

    function getContragents() {
      canvasRef.current.className = "canvas_spin"
        fetch('https://activities-server-db.herokuapp.com/m')
        .then(response => {
          return response.text();
        })
        .then(data => {
          
          const id1= JSON.parse(data)
          const id = toLocale(id1)
          setData(id);
          canvasRef.current.className = "canvas"
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
      if(!serverActivated){
        setFirstAlert(true)
      }
      setFileAlert(true)
      setServerActivated(!serverActivated)
      if(!firstAlert){
     setInfo_modal(!info_modal)}

     if(!calRef.current.value){
        getContragents()
     } else {
        getTimes()
      }
    if(!serverActivated){
      setData(data1)}
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
      dateRef.current.checked = false
      setRangeAmount(!rangeAmount)
      setRangeDate(false)
    }
    
    function rangeByDate(){
      amountRef.current.checked = false
      setRangeDate(!rangeDate)
      setRangeAmount(false)
    }

    function calendarFunc(){
      setDateActivated(true)
      canvasRef.current.className = "canvas_spin"
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
      if(!calRef.current.value){
        setDateActivated(false)}
        canvasRef.current.className='canvas'
    } 
    
    
    const ModalFile =({serverActivated, fileAlert}:Modal)=>{
      if(!serverActivated&&!fileAlert){
        return(
            <div ref = {modalRef} className = {(!info_modal)?"alert":"alert_hidden"}>
                Behind you see data from local json file. <br/>
                If you want to manage your own data,
                you may <b>"Activate server"</b> and begin to work with them.
                <button className = "modal_btn" onClick = {hideModal}>X</button>  
            </div>
        )} else {return null}
      } 

      const ModalServer = ({serverActivated, fileAlert}:Modal) =>{
        if(serverActivated&&fileAlert){
          return( 
           <div ref = {modalRef}  className = {(!info_modal)?"alert":"alert_hidden"}>
              At the moment database may countain data of other users. <br/>
              You may use or add them or "Clear database" and work from scratch.
              <button className = "modal_btn" onClick = {hideModal}>X</button>
           </div>
        )}else {return null}
    }

  return(
      <div className ="app_wrapper"> 
       <ModalFile serverActivated = {serverActivated} fileAlert = {fileAlert}/>
       <ModalServer serverActivated = {serverActivated} fileAlert = {fileAlert}/>
       <div className = "tablo" onClick = {getServerData}>
              <nav className = "navpanel">
                   <ul>
                      <Link to = "/tab=0"><li /*onClick = {(e)=>e.current.target.addEventListener('click', ()=>
                      e.target.color = "red")}*/>Income</li></Link>
                      <Link to = "/tab=1"><li>Outcome</li></Link>
                      <Link to = "/tab=2"><li>Loans</li></Link>
                      <Link to = "/tab=3"><li>Investments</li></Link>
                      <Link to = "/tab=4"><li>Contragents</li></Link>
                      <Link to = "/"><li>Summary</li></Link> 
                      <Link to = "/tab=5"><li>New transaction</li></Link>
                    </ul>
              </nav>
          </div>
          <div className="change">
              <input type = "date" ref = {calRef} onInput = {calendarFunc}/>
              <select ref = {selectRef1} onChange = {calendarFunc}>
                <option>Before</option>
                <option>Until</option>
                <option>For</option>
                <option>From</option>
                <option>After</option>
              </select> 
               <div className = "range">
                Range by: amount
               <input type = "checkbox" onChange={rangeByAmount} ref ={amountRef}></input>
                date
              <input type = "checkbox" onChange={rangeByDate} ref = {dateRef}></input>
               </div>
              <ul className = "callServer">
                <li><input type = 'checkbox' onChange = {startServer}></input>Activate server</li>
                <li><input type = 'checkbox' onChange = {clearDatabase}></input>Clear database</li>
              </ul>
          </div>
           <Routes>
              <Route path = "/tab=0" element ={<Activity someactivity = {sumIncome} type = "Income" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color ="red" cref = {calRef} sref = {selectRef1}/>}/>
              <Route path = "/tab=1" element ={<Activity someactivity = {sumOutcome} type = "Outcome" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color ="steelBlue"cref = {calRef} sref = {selectRef1}/>}/>
              <Route path = "/tab=2" element ={<Activity someactivity = {sumLoan} type = "Loan" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color = "yellow"cref = {calRef} sref = {selectRef1}/>} />
              <Route path = "/tab=3" element ={<Activity someactivity = {sumInvest} type  = "Investment"rangeAmount = {rangeAmount} rangeDate = {rangeDate} color = "lightgreen"cref = {calRef} sref = {selectRef1}/>}/>
              <Route path = "/tab=4" element ={<Contragent data = {data} dateData = {dateData} serverActivated = {serverActivated} dateActivated = {dateActivated}
                                                                        sumincome = {sumIncome}
                                                                        sumoutcome = {sumOutcome}
                                                                        sumloans = {sumLoan}
                                                                        suminvest = {sumInvest}/>}/>
              <Route path = "/" element ={<Summary data = {data} sumincome = {sumIncome}
                                                                 sumoutcome = {sumOutcome}
                                                                 sumloans = {sumLoan}
                                                                 suminvest = {sumInvest}
                                                                 cref = {calRef} 
                                                                 sref = {selectRef1}/>}/>
              <Route path = "/tab=5" element ={<Transaction data={data}/>}/>
          </Routes> 
          <div className = "canvas" ref = {canvasRef}>
          </div>
      </div>
      )
    }

  export default App;
  
import './App.css';
import {Routes, Route , Link }from 'react-router-dom';
import dataFromFile from "./list.json"
import React, { useState, useRef, useEffect} from 'react';
import {Activity, Contragent, Summary, Transaction, /*Welcome,*/ getSum} from './Form'

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
 interface Welcome {
  someData:newData[]|undefined,
  trans:string,
  color:string,
  tab:string,
  ref:React.MutableRefObject<HTMLDivElement>
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

   export const WelcomePage=({someData, trans, color,tab,ref}:Welcome)=>{
      if(someData&&someData.length!==0){
          const totalCount = someData.length
          //const totalAmount:number|null =someData.map((item)=>item.amount).reduce(getSum,0)
          //console.log(totalAmount)
          return (
              <div className = "welcome">
                  <div /*className = "total"*/><b>{totalCount}</b>{/*<div>{totalAmount}</div>*/}</div>
                  <div /*className = "trans"*/>{trans}</div>
                  <button className = "seeall" style = {{backgroundColor:`${color}`}}>
                    <Link to = {`/tab=${tab}`} style = {{color:"white"}}  onClick={()=>ref.current.style.color= "red"}>See all</Link>
                  </button>
              </div>)
      } else {
          return (
              <div /*className = "welcome"*/>
                  <div className ="total">-</div>
                  <div className = "trans">{trans}</div>
                  <div className= "color" id = "amount_summ">No {trans} at this period</div>

                  {/*<div className = "amount">No</div>*/}
              </div>
          )
      }
  }
  const handleClick =(arr:React.MutableRefObject<HTMLLIElement>[],/*ref:React.MutableRefObject<HTMLDivElement>,*/event:React.MouseEvent<HTMLLIElement>|React.MutableRefObject<HTMLDivElement>,i:number)=>{
    arr[i].current.style.color="red";
    arr[i].current.style.borderColor="red" 
    //ref.current.style.visibility = "hidden"
    for(let a=0;a<arr.length;a++){
     if (a!==i){arr[a].current.style.color = "rgb(44, 39, 39)"
                arr[a].current.style.borderColor = "rgb(44,39,39"
     }
   }
  

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
    const wrapperRef = useRef() as React.MutableRefObject<HTMLDivElement>
    const loaderRef = useRef() as React.MutableRefObject<HTMLDivElement>
    const modalRef = useRef() as React.MutableRefObject<HTMLDivElement>
    const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const dbaseRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const spanRef = useRef() as React.MutableRefObject<HTMLSpanElement>
    const menuRef = useRef() as React.MutableRefObject<HTMLUListElement>
    const labelRef = useRef() as React.MutableRefObject<HTMLDivElement>
    const calRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const selectRef1 = useRef() as React.MutableRefObject<HTMLSelectElement>
    const amountRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const dateRef = useRef() as React.MutableRefObject<HTMLInputElement>

    const inRef = useRef() as React.MutableRefObject<HTMLLIElement >
    const outRef = useRef() as React.MutableRefObject<HTMLLIElement >
    const loanRef = useRef() as React.MutableRefObject<HTMLLIElement >
    const invRef = useRef() as React.MutableRefObject<HTMLLIElement >
    const sumRef = useRef() as React.MutableRefObject<HTMLLIElement >
    const contRef = useRef() as React.MutableRefObject<HTMLLIElement >
    
    const arr = [inRef, outRef, loanRef, invRef, contRef,sumRef]
    
    

    const handleClickTransaction = (event:React.MouseEvent<HTMLLIElement>)=>{
      for(let a=0;a<arr.length;a++){
        arr[a].current.style.color = "rgb(44, 39, 39)"
        arr[a].current.style.borderColor = "rgb(44,39,39"
        }
      }
         
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
      loaderRef.current.className = "loader_spin"
        fetch('https://activities-server-db.herokuapp.com/m')
        .then(response => {
          return response.text();
        })
        .then(data => {
          const id1= JSON.parse(data)
          const id = toLocale(id1)
          setData(id);
          loaderRef.current.className = "loader"
          console.log(data)
         })
      }
 
    function getTimes() {
      const date = calRef.current.value
      const sign = selectRef1.current.value
      loaderRef.current.className = "loader_spin"
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
            }loaderRef.current.className = "loader"
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
      fileRef.current.checked = false
      
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

     function showMenu (){
      menuRef.current.classList.toggle('menu_open')
      labelRef.current.classList.toggle('label_up')
    }
 
   function getFileData(){
    setData(data1)
    setServerActivated(false)
    dbaseRef.current.checked = false
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
      loaderRef.current.className = "loader_spin"
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
        loaderRef.current.className='loaderr'
    } 
    
      const ModalFile =({serverActivated, fileAlert}:Modal)=>{
      if(!serverActivated&&!fileAlert){
        return(
            <div ref = {modalRef} className = {(!info_modal)?"alert":"alert_hidden"}>
                Behind you see data from local json file. <br/>
                If you want to input and operate your own data,
                you may change mode to <b>"Database"</b> and begin to work with them.
                <button className = "modal_btn" onClick = {hideModal}>X</button>  
            </div>
        )} else {return null}
      } 

      const ModalServer = ({serverActivated, fileAlert}:Modal) =>{
        if(serverActivated&&fileAlert){
          return( 
           <div ref = {modalRef}  className = {(!info_modal)?"alert":"alert_hidden"}>
              At the moment database may countain data of other users. <br/>
              You may use or add them or <b>"Clear database"</b> and work from scratch.
              <button className = "modal_btn" onClick = {hideModal}>X</button>
           </div>
        )}else {return null}
    }

  return(
      <div className ="app_wrapper"> 
       <ModalFile serverActivated = {serverActivated} fileAlert = {fileAlert}/>
       <ModalServer serverActivated = {serverActivated} fileAlert = {fileAlert}/>
       <div className = "tablo" onClick={getServerData}>
              <nav className = "navpanel">
                   <ul>
                      <Link to = "/tab=0"><li ref = {inRef}  onClick ={e=>handleClick(arr,e,0)} >Income</li></Link>
                      <Link to = "/tab=1"><li ref = {outRef} onClick ={e=>handleClick(arr,e,1)}>Outcome</li></Link>
                      <Link to = "/tab=2"><li ref = {loanRef} onClick ={e=>handleClick(arr,e,2)}>Loans</li></Link>
                      <Link to = "/tab=3"><li ref ={invRef} onClick ={e=>handleClick(arr,e,3)}>Investments</li></Link>
                      <Link to = "/tab=4"><li ref = {contRef} onClick ={e=>handleClick(arr,e,4)}>Contragents</li></Link>
                      <Link to = "/tab=5"><li ref = {sumRef} onClick ={e=>handleClick(arr, e,5)} id = "red">Summary</li></Link> 
                      <Link to = "/tab=6"><li onClick = {handleClickTransaction} id = "black">New transaction</li></Link>
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
                  <li><span ref = {spanRef} className='callServerSpan' onClick = {showMenu}>Data source <div ref  ={labelRef} className = "label_down"></div> {(!serverActivated)?"File":"Database"}</span></li>
                  <ul ref  ={menuRef} className =  "menu">
                    <li><input type = "radio" onChange = {getFileData} name ="choose" ref = {fileRef} defaultChecked/>File</li>
                    <li><input type = 'radio' onChange = {startServer}  name = "choose" ref ={dbaseRef}/>Database</li>
                    <li className ={serverActivated?"info1":"noinfo1"}><input type = 'checkbox' onChange = {clearDatabase}/><span style ={{color: "red"}}>Clear database</span></li>
                  </ul>
              </ul>
          </div>
           <Routes>
              <Route path = "/tab=0" element ={<Activity someactivity = {sumIncome} type = "Income" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color ="red" cref = {calRef} sref = {selectRef1}/>}/>
              <Route path = "/tab=1" element ={<Activity someactivity = {sumOutcome} type = "Outcome" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color ="steelBlue"cref = {calRef} sref = {selectRef1}/>}/>
              <Route path = "/tab=2" element ={<Activity someactivity = {sumLoan} type = "Loan" rangeAmount = {rangeAmount} rangeDate = {rangeDate} color = "yellow"cref = {calRef} sref = {selectRef1}/>} />
              <Route path = "/tab=3" element ={<Activity someactivity = {sumInvest} type  = "Investment"rangeAmount = {rangeAmount} rangeDate = {rangeDate} color = "lightgreen"cref = {calRef} sref = {selectRef1}/>}/>
              <Route path = "/tab=4" element ={<Contragent data = {data} dateData = {dateData} serverActivated = {serverActivated} dateActivated = {dateActivated} cref = {calRef} sref = {selectRef1}
                                                                        sumincome = {sumIncome}
                                                                        sumoutcome = {sumOutcome}
                                                                        sumloans = {sumLoan}
                                                                        suminvest = {sumInvest}/>}/>
              <Route path = "/tab=5" element ={<Summary data = {data} sumincome = {sumIncome}
                                                                      sumoutcome = {sumOutcome}
                                                                      sumloans = {sumLoan}
                                                                      suminvest = {sumInvest}
                                                                      cref = {calRef} 
                                                                      sref = {selectRef1}/>}/>
              <Route path = "/tab=6" element ={<Transaction data={data}/>}/>
              </Routes> 
              <div className = "welcome1"ref = {wrapperRef}>
                <div className='inwelcome'> 
                    <div>
                        <span style = {{fontSize:"20px"}}><b>Welcome</b></span>    
                        <span style = {{display:"block"}}>With supporting text below  as a natural lead-in to additional content</span>
                        <button className='seeall first'>All transactions</button>
                    </div>
                    <div>You have {data.length} transactions</div>
                </div>
              <div className = "summary_info1">
              <WelcomePage someData = {sumIncome} trans = "Income" color =  "red" tab = "0" ref = 'wrapperRef'/>
              <WelcomePage someData = {sumOutcome} trans = "Outcome" color =  "steelBlue" tab = "1" ref = 'wrapperRef' />
              <WelcomePage someData = {sumLoan} trans = "Loan" color =  "yellow" tab = "2" ref = 'wrapperRef'/>
              <WelcomePage someData = {sumInvest} trans = "Investment" color =  "lightgreen" tab = "3" ref = 'wrapperRef'/>
              </div>
  </div>
              <div className = "loader" ref = {loaderRef}></div>
          </div>
     )
    }

  export default App;
  
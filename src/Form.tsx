import React, {useRef, useState} from 'react'
import {v4} from 'uuid'
import {Date1} from './App'

type newData = {
    _id: string;
    amount:number;
    type:string;
    name?:{
      last:string|undefined,
      first:string|undefined
    }|undefined;
    fullname:string;
    company?:string|undefined;
    email: string;
    phone:string;
    address:string;
    date:string;
    question?:string
}
  
    type oldData = {
      _id: string;
      amount:number;
      type:string;
      name?:{
        last:string|undefined,
        first:string|undefined
      }|undefined;
      fullname?:string|undefined;
      company?:string;
      email: string;
      phone:string;
      address:string;
      date:string;
      question?:string
      }
      
    interface Activity1 {
        someactivity:newData[]|undefined,
        type:string,
        rangeAmount:boolean,
        rangeDate:boolean,
        color:string,
        cref:React.MutableRefObject<HTMLInputElement>,
        sref:React.MutableRefObject<HTMLSelectElement> 
    }
    interface PersonalActivity1 {
        type:string,
        activity:number|null|undefined,
        somearray:newData[]|undefined,
        someref:React.MutableRefObject<HTMLInputElement>,
        color:string,
        dateActivated:boolean
    }
    interface Contragent1 {
        data:newData[]|undefined,
        dateData:newData[]|undefined,
        sumincome:newData[]|undefined,
        sumoutcome:newData[]|undefined,
        sumloans:newData[]|undefined,
        suminvest:newData[]|undefined,
        serverActivated:boolean,
        dateActivated:boolean,
        cref:React.MutableRefObject<HTMLInputElement>,
        sref:React.MutableRefObject<HTMLSelectElement> 
    }
    interface Summary1 {
        data:newData[]|undefined,
        sumincome:newData[]|undefined,
        sumoutcome:newData[]|undefined,
        sumloans:newData[]|undefined,
        suminvest:newData[]|undefined,
        cref:React.MutableRefObject<HTMLInputElement>,
        sref:React.MutableRefObject<HTMLSelectElement>,
    }
      interface getSummary {
        someData:newData[]|undefined,
        trans:string,
        color:string
    }

      interface Transaction1 {
        data:newData[]|undefined,
      }

// Removes duplicates from array
function removeDoubleNameSum(array:oldData[]|newData[]|null) {
   if(array){
    for (let i=0;i<array.length-1;i++){
        if(array[i].fullname===array[i+1].fullname){
            array[i+1].amount =array[i+1].amount + array[i].amount
            array[i].amount = 0;
        }
    }
}
}

function removeDoubleDateSum(array:newData[]){
    for (let i=0;i<array.length-1;i++){
        if(array[i].date===array[i+1].date){
            array[i+1].amount = array[i].amount + array[i+1].amount
            array[i].amount = 0
        }
    }
}

// Retrieving max value of array
function getMaxValue(array:newData[]){
    const maxVal = array.map(item=>item.amount).reduce((max, prop)=>{
    if(prop>max){return prop}
    else {return max}
    },0)
    return maxVal
}

// Getting sum of all array elements
function getSum(total:number, number:number):number{
   return total+number}
   
function updateContragent(e:React.ChangeEvent<HTMLTextAreaElement>,_id:string){
     fetch('https://activities-server-db.herokuapp.com/update', {
      method: "PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
      question: e.target.value,
      _id:_id})
    })
    .then(response=> {
      return response.text()
   }).then(data=>{
    console.log(data);
   });
}

export const Activity = ({someactivity, type, rangeAmount, rangeDate,color, cref, sref}:Activity1)=>{
    if(someactivity){
        const _someData:newData[] = structuredClone(someactivity)
        .sort((a:newData,b:newData)=> (a.fullname>b.fullname)?1:((a.fullname<b.fullname)?-1:0))
        if(!rangeDate){
            removeDoubleNameSum(_someData)
        }else{
            removeDoubleDateSum(_someData)
        }
        const someData = _someData.filter(item=>item.amount!==0)
        const maxVal = getMaxValue(someData)
        const perPixel = maxVal/320
        const totalAmount = someData.map(item=>item.amount).reduce(getSum,0)
        if(!rangeAmount&&!rangeDate){
            return(
            <div className = "component_wrapper">
                <Date1 cref = {cref} sref  ={sref}/>
                <div>
                    <div className = "activity_info" style = {{borderBottom:`2px solid ${color}`}}><h3>{type} {totalAmount}</h3></div>
                   {someData.map((item:newData,i:number)=>
                    <li className = "activity" key = {i} >
                        <div className = "fullname"> {item.fullname}</div>
                        <div className = "amount1">{item.amount}</div>
                        <div className ="rectangle" style = {{backgroundColor:`${color}`, width:`${item.amount/perPixel}px`, height:"20px"}}></div>
                    </li>)}
                </div>
            </div>
            )
        }
        else 
        if(rangeAmount&&!rangeDate){
            return(
                <div className = "component_wrapper">
                     <Date1 cref = {cref} sref  ={sref}/>
                     <div className = "activity_info" style = {{borderBottom:`2px solid ${color}`}}><h3>{type} {totalAmount}</h3></div>
                    {someData
                    .sort((a:newData,b:newData)=>(a.amount<b.amount)?1:(a.amount>b.amount)?-1:0)//))  
                    .map((item,i)=>
                    <li className = "activity" key = {i} >
                        <div className ="fullname">{item.fullname}</div>
                        <div className = "amount1">{item.amount}</div>
                        <div className = "rectangle" style = {{backgroundColor:`${color}`, width:`${item.amount/perPixel}px`, height:"20px"}}></div>
                    </li>)}
               </div>)
        }
        else 
        if(!rangeAmount&&rangeDate){
            return(
                <div className = "component_wrapper">
                    <Date1 cref = {cref} sref  ={sref}/>
                    <div className = "activity_info" style = {{borderBottom:`2px solid ${color}`}}><h3>{type} {totalAmount}</h3></div>
                    {someData
                    .sort((a:newData,b:newData)=>(a.date>b.date)?1:(a.date<b.date)?-1:0)
                    .map((item,i)=>
                    <li className="activity"  key = {i} >
                        <div className = "fullname">{item.date} </div>
                        <div className = "amount1">{item.amount}</div>
                        <div className = "rectangle" style = {{backgroundColor:`${color}`, width:`${item.amount/perPixel}px`, height:"20px"}}></div>
                    </li>)}
                </div>)
        } else {return null}
    } else {return null} 
}



    export const Summary = ({sumincome, sumoutcome, sumloans, suminvest, cref, sref}:Summary1)=> {

        function getEveryAmount(array:newData[]|undefined): number|null {
            if(array){
                const summ = array.map(item=>(item.amount)).reduce(getSum,0)
                console.log(summ)
                return summ
            } else {return null}
        }
    
        const uu:(number|null)[] = [sumincome,sumoutcome, sumloans,suminvest].map(item=>getEveryAmount(item))
            console.log(uu)
        
        function gmv1(array:(number|null)[]){
            let maxVal:number|null;
            if(array){
                 maxVal = array.reduce((max:number|null, prop:number|null):number|null=>{
                if(prop&&max){
                    if(prop>max){
                        return prop}
                    else {
                        return max}
                } else if(!prop&&max){
                    return max}
                  else {return prop}},0)
                return maxVal
            }
        }    
       
      const yu:number|null|undefined = gmv1(uu)
      console.log(yu)
         
         const GetSummary =({someData, trans, color}:getSummary) => {
            if(someData&&someData.length!==0&&yu){
                const totalCount = someData.length
                const totalAmount:number|null =someData.map((item)=>item.amount).reduce(getSum,0)
                console.log(totalAmount)
                return (
                    <div className = "summaryclass">
                        <div className = "trans">{trans}</div>
                        <div className = "total">{totalCount}</div>
                        <div className ="color" style =  {{backgroundColor:`${color}`, width:`${totalAmount/yu*320}px`, height:"20px"}}></div>
                        <div className = "amount">{totalAmount}</div>
                    </div>)
            } else {
                return (
                    <div className = "summaryclass">
                        <div className = "trans">{trans}</div>
                        <div className ="total">-</div>
                        <div className= "color" id = "amount_summ">No {trans} at this period</div>
                        <div className = "amount">No</div>
                    </div>
                )
            }
        }
        return(
          <div className = "component_wrapper">
               <Date1 cref = {cref} sref  ={sref}/>
               <div className="summaryclass summaryheader"><h4>Count</h4><span></span><h3>Summary</h3><h4>Amount</h4></div>
               <ul>
                    <li><GetSummary someData = {sumincome} trans = "income" color = "red"/></li>
                    <li><GetSummary someData = {sumoutcome} trans = "outcome" color = "steeLBlue"/></li>
                    <li><GetSummary someData = {sumloans} trans ="loan" color = "yellow"/></li>
                    <li><GetSummary someData = {suminvest} trans = "investment" color ="forestgreen"/></li>
                </ul>
          </div>
        )
      }
      const PersonalActivity = ({type, activity, somearray,someref}:PersonalActivity1)=>{ 
        const noteRef = useRef() as React.MutableRefObject<HTMLInputElement>
       if(somearray&&activity&&someref.current.value!=='') {
          return(
               <div>
                   <ul className={(type==="income")?"red":(type=== "outcome")?"steelblue":(type ==="loan")?"yellow":"green"}>
                           {(somearray&&somearray.length!==0)? somearray
                               .filter(item=>`${item.fullname}`===someref.current.value)
                               .filter(item=>item.type===`${type}`)
                               .sort((a,b)=>(a.date>b.date)?1:(a.date<b.date)?-1:0)
                               .map((item, i)=>
                                   <li className = "showcontragent" key = {i}>
                                      {item.date} : {item.amount}
                                      <textarea defaultValue = {item.question} 
                                                onMouseOver= {()=>noteRef.current.className = "info" } 
                                                onClick = {()=>noteRef.current.className = "comments"} 
                                                onMouseLeave={()=>noteRef.current.className = "comments" }
                                                onBlur = {(e)=>updateContragent(e,item._id)}>
                                      </textarea>
                                               <span ref = {noteRef} className = "comments">Change note</span>
                                   </li>)
                               :null} 
                           </ul>
                       </div>)
           } else if(somearray&&activity&&someref.current.value==='') {return null} else {return null}
       }

export const Contragent =({data, dateData,sumincome, sumoutcome, sumloans, suminvest, dateActivated, cref, sref}:Contragent1)=>{
    const [sumIncome0, setSumIncome0] = useState<number|null>()
    const [sumOutcome0, setSumOutcome0] = useState<number|null>()
    const [sumLoans0, setSumLoans0] = useState<number|null>()
    const [sumInvest0, setSumInvest0] = useState<number|null>()
    const [reg, setReg] = useState<string>('')
    const listRef = useRef() as React.MutableRefObject<HTMLDivElement>
    const selectRef = useRef() as React.MutableRefObject<HTMLInputElement>

    function changeInput(e:React.ChangeEvent<HTMLInputElement>) {
        const reg1= e.target.value
        setReg(reg1)
        listRef.current.className = "list"
        }
    const n = new RegExp(reg)
   
    function getPersonal(someData:newData[]|undefined,selectref:React.MutableRefObject<HTMLInputElement>):number|null{
        console.log(selectref.current.value)
        return (someData&&someData.length!==0)?someData.filter(item=>item.fullname === selectref.current.value)
        .map(item=>item.amount)
        .reduce(getSum,0)
        :null
       
    }

    function showContragent(){
        const incomes = getPersonal(sumincome, selectRef)
        const outcomes = getPersonal(sumoutcome,selectRef)
        const loans =  getPersonal(sumloans,selectRef)
        const investments = getPersonal(suminvest, selectRef)
        setSumIncome0(incomes)
        setSumOutcome0(outcomes)
        setSumLoans0(loans)
        setSumInvest0(investments)
        if(selectRef.current.value!==''){listRef.current.className = "list_hidden"}else{listRef.current.className = "list"}
        console.log( listRef.current.className)
    }

     function cleanInput(){
        selectRef.current.value = ''
        showContragent()
     }
        if(data){
        let _someData:newData[]
        _someData = structuredClone((!dateActivated)?data:dateData).sort((a:newData,b:newData)=>(a.fullname>b.fullname)?1:((a.fullname<b.fullname)?-1:0))
        removeDoubleNameSum(_someData)
        const list = _someData.filter(item=>item.amount!==0)

        const sho = (_id:string) =>{
            console.log(list)
            const name1 = list.filter(item=>item._id===_id)
            selectRef.current.value=name1[0].fullname
        }

        if(!selectRef.current||selectRef.current.value === ''){
            return (
                <div className = "component_wrapper">
                     <Date1 cref = {cref} sref  ={sref}/>
                     <div className = "wrapper_contr">
                        <input ref = {selectRef} type = "text" onChange = {changeInput}></input><button className = "hide" onClick={cleanInput}>X</button>
                        <div ref = {listRef} className =  "list">
                        {list.map((item,i)=>
                        <li className = "showcontragent" key ={item._id} onClick = {()=>sho(item._id)}>{item.fullname}</li>)}
                        <button className="show"onClick ={showContragent}>Show</button>
                    </div>
                    </div>
                </div>)
        } else {
            return (
                <div className = "component_wrapper">
                    <Date1 cref = {cref} sref  ={sref}/>
                    <div className = "wrapper_contr">
                        <input  ref = {selectRef} type = "text" onChange ={changeInput}></input><button className = "hide" onClick={cleanInput}>X</button>
                     <div ref = {listRef} className = "list">
                         {(list&&list.length!==0)
                         ?list.filter(item=>n.test(item.fullname))
                              .map(item =>
                        <li className = "showcontragent" key ={item._id} onClick = {()=>sho(item._id)}>{item.fullname}</li>)
                        :null
                        } 
                        <button className = "show" onClick ={showContragent}>Show</button>
                   </div>
                    <div className = "personal_activity">
                        <div><span>Incomes</span><PersonalActivity type = "income" activity = {sumIncome0} somearray = {sumincome} someref = {selectRef} color = "red" dateActivated = {dateActivated}/></div>
                        <div><span>Outcomes</span><PersonalActivity type = "outcome" activity = {sumOutcome0} somearray = {sumoutcome} someref = {selectRef} color = "blue" dateActivated = {dateActivated}/></div>
                        <div><span>Loan</span><PersonalActivity type = "loan" activity = {sumLoans0} somearray = {sumloans} someref = {selectRef} color = "yellow" dateActivated = {dateActivated}/></div>
                        <div><span>Investment</span><PersonalActivity type = "investment" activity = {sumInvest0} somearray = {suminvest} someref = {selectRef} color = "lightgreen"dateActivated = {dateActivated}/></div>
                    </div>
                    </div>
                </div>)
                }
    } else {return null}
} 

export const Transaction=({data}:Transaction1)=>{
    const lnRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const fnRef =  useRef()as React.MutableRefObject<HTMLInputElement>
    const amRef = useRef()as React.MutableRefObject<HTMLInputElement>
    const trRef = useRef() as React.MutableRefObject<HTMLSelectElement>
    const mailRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const numRef = useRef()as React.MutableRefObject<HTMLInputElement>
    const adRef = useRef()as React.MutableRefObject<HTMLInputElement>
    const dateRef = useRef()as React.MutableRefObject<HTMLInputElement>
    const qRef = useRef()as React.MutableRefObject<HTMLTextAreaElement>
    const submitRef = useRef() as React.MutableRefObject<HTMLInputElement>
  
   const [l, setL]= useState<string>('')
   const [viewLast,setViewLast]= useState(false)
   const [viewFirst,setViewFirst]= useState(false)
   const [viewInfo, setViewInfo] = useState(true)
   const [checkbox, setCheckbox] = useState(false)
  
  const submit=(e:React.ChangeEvent<HTMLFormElement>)=>{
    e.preventDefault()
    createContragent()
    lnRef.current.value=''
    fnRef.current.value=''
    amRef.current.value=''
    trRef.current.value=''  
    mailRef.current.value='' 
    numRef.current.value=''
    adRef.current.value=''
    dateRef.current.value=''
    qRef.current.value = ''
    } 

   function createContragent(){
    submitRef.current.disabled = true
    fetch('https://activities-server-db.herokuapp.com/contragents',{
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
      },
    body:JSON.stringify({
      _id: v4(),
      fullname: `${lnRef.current.value} ${fnRef.current.value}`,
      date:dateRef.current.value,
      type:trRef.current.value.toLowerCase(),
      amount:amRef.current.value,
      email:mailRef.current.value,
      phone:numRef.current.value,
      address:adRef.current.value,
      question:adRef.current.value
      })
    })
    .then(response => {
          return response.json()   
    })
    .then(data => {
        console.log(data);
        submitRef.current.disabled = false
    })
    .catch(err =>console.log(err));
    }
 
  let  lastName:newData[]|null,firstName:newData[]|null
   
    const lastname = (e:React.ChangeEvent<HTMLInputElement>) =>{
       const l1 = e.target.value
      setL(l1)
      console.log(viewLast)
      setViewLast(true)
    
     
      if(lastName&&lastName.length!==0){
        for (let i of lastName){
          if(e.target.value===i.fullname.split(/\s/)[0]||!ln.test(i.fullname.split(/\s/)[0])){setViewLast(false)}
            }
      }
      
      if(!lnRef.current.value){setViewLast(false)}
      if(!lnRef.current.value){clearPersonalData()}
    }
     
   const ln= new RegExp(l)
    const firstname = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const f1 = e.target.value
    const fn = new RegExp(f1)
    setViewFirst(true)
       
    if(firstName&&firstName.length!==0){
      for (let i of firstName){
        if(e.target.value===i.fullname.split(/\s/)[1]||!fn.test(i.fullname.split(/\s/)[1])){setViewFirst(false)}
       }
     } 
     if(!fnRef.current.value){setViewFirst(false)}
     if(!fnRef.current.value){clearPersonalData()}
    } 
   
   
  const lastName1 = (data&&l)?(data.filter(item=>ln.test(item.fullname.split(/\s/)[0])).sort((a,b)=>(a.fullname.split(/\s/)[0] > b.fullname.split(/\s/)[0]) ? 1 :((b.fullname.split(/\s/)[0] < a.fullname.split(/\s/)[0]) ? -1: 0))):null
  removeDoubleNameSum(lastName1)
  lastName = (lastName1)?(lastName1.filter(item=>item.amount!==0)):null
  const firstName1 = (data&&l)?data.filter(item=>item.fullname.split(/\s/)[0]===lnRef.current.value).sort((a,b)=>(a.fullname.split(/]s/)[1] > b.fullname.split(/\s/)[1]) ? 1 :((b.fullname.split(/\s/)[1] > a.fullname.split(/\s/)[1]) ? -1: 0)):null
  removeDoubleNameSum(firstName1)
  firstName = (firstName1)?firstName1.filter(item=>item.amount!==0):null

       const onClickLast = (_id:string) =>{
       const name1 = (lastName)?lastName.filter(item=>item._id===_id):[]
       lnRef.current.value = name1[0].fullname.split(/\s/)[0]
       setViewFirst(true)
       setViewLast(false)
       firstName = (lastName)?(lastName.filter(item=>lnRef.current.value===item.fullname.split(/\s/)[0])
                           .sort((a,b)=>(a.fullname.split(/\s/)[0] > b.fullname.split(/\s/)[0]) ? 1 :((b.fullname.split(/\s/)[0] > a.fullname.split(/\s/)[0]) ? -1: 0)))
                           :null
      } 
    
  
    const onClickFirst = (_id:string) =>{
        const name1 = (firstName)?firstName.filter(item=>item._id===_id):[]
        fnRef.current.value = name1[0].fullname.split(/\s/)[1]
        setViewFirst(false)
        const dateBefore= (data)?(data.filter(item=>(item.fullname.split(/\s/)[0]===lnRef.current.value&&item.fullname.split(/\s/)[1]===fnRef.current.value))
        .filter(item=>(item.date<=dateRef.current.value))
        .sort((a,b)=>(a.date>b.date)?1:((b.date>a.date)?-1:0))):null
        const dateAfter = (data)?(data.filter(item=>(item.fullname.split(/\s/)[0]===lnRef.current.value&&item.fullname.split(/\s/)[1]===fnRef.current.value))
        .filter(item=>(item.date>=dateRef.current.value))
        .sort((a,b)=>(a.date>b.date)?1:((b.date>a.date)?-1:0))):null

        const latestData = (dateBefore&&dateBefore.length!==0)?dateBefore[dateBefore.length-1]:(dateAfter&&dateAfter.length!==0)?dateAfter[0]:null
        mailRef.current.value = (latestData)?latestData.email:'';
        numRef.current.value = (latestData)?latestData.phone:'';
        adRef.current.value = (latestData)?latestData.address:'';
        setCheckbox(true)
        setViewInfo(false)
    }
        const clearPersonalData = ():void=>{
        mailRef.current.value = '';
        numRef.current.value = '';
        adRef.current.value = '';
        }

      return(
        <div className = "component_wrapper" >
            <form className = "form" onSubmit ={submit} autoComplete = "off">  
              <label>Transaction <span>*</span>
                <select ref ={trRef}>
                    <option>Income</option>
                    <option>Outcome</option>
                    <option>Loan</option>
                    <option>Investment</option>
                </select></label>
                <label>Date <span>*</span>
                    <input type='date' ref = {dateRef} required/></label>
                <label>Last name <span>*</span>
                    <input type='text' name='userlastname' ref = {lnRef} onChange = {lastname} required/></label>
                    <ul className = {(viewLast)?"visiblement lastname":"cached"}> {(lastName&&lastName.length!==0)?(lastName.map((item, i)=><li key = {i} onClick = {()=>onClickLast(item._id)}>{item.fullname.split(/\s/)[0]}</li>)):null}</ul>
                    <label>First name <span>*</span>
                    <input type='text' name='userfirstname' ref = {fnRef} onChange ={firstname} required/></label>
                <ul className = {(viewFirst)?"visiblement firstname":"cached"}>{(firstName&&firstName.length!==0)?(firstName.map((item, i)=><li key = {i} onClick = {()=>onClickFirst(item._id)}>{item.fullname.split(/\s/)[1]}</li>)):null}</ul>
                <label>Amount <span>*</span>
                <input type='number' name='amount' ref = {amRef} required/></label>
                <div className = {(!checkbox)?"cached":"info"}>
                    <label>Change personal data</label>
                    <input id ="viewinfo" type = "checkbox" onChange = {()=>setViewInfo(!viewInfo)}/>
                </div>
                    <div className = {(viewInfo)?"info":"noinfo"}>
                        <label>E-mail <span>*</span>
                        <input type='text' name='usermail' ref = {mailRef}/></label>
                        <label>Phone <span>*</span>
                        <input type='text' name='usernumber' ref = {numRef}/></label>
                        <label>Address <span>*</span>
                        <input type='text' name='address'ref = {adRef}/></label>
                        </div>
                        <label>Notes
                        <textarea className = "text" name='question' ref = {qRef}/></label>
                        <label>
                        <input type='submit' value='Send' ref = {submitRef}/></label>
            </form>
        </div>
      )}
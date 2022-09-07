import React, {useRef, useState} from 'react'
import {v4} from 'uuid'

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
        color:string
    }

    interface PersonalActivity1 {
        type:string,
        activity:number|null|undefined,
        somearray:newData[]|undefined,
        someref:React.MutableRefObject<HTMLInputElement>,
    }

    interface Contragent1 {
        data:newData[]|undefined,
        sumincome:newData[]|undefined,
        sumoutcome:newData[]|undefined,
        sumloans:newData[]|undefined,
        suminvest:newData[]|undefined,
        serverActivated:boolean 
      }

      interface Summary1 {
        data:newData[]|undefined,
        sumincome:newData[]|undefined,
        sumoutcome:newData[]|undefined,
        sumloans:newData[]|undefined,
        suminvest:newData[]|undefined,
    }
      interface getSummary {
        someData:newData[]|undefined,
        trans:string
    }

      interface Transaction1 {
        data:newData[]|undefined,
      }


function removeDoubleLast (array:newData[]){
    for (let i=0;i<array.length-1;i++) {
        if(array[i].fullname.split(/\s/)[0]===array[i+1].fullname.split(/\s/)[0]){
           array[i].amount=0 ;
           /*const clean = array.filter(item=>item.amount!==0)
           return clean*/
        }
    } 
} 

function removeDoubleFirst(array:newData[]){
    for (let i=0;i<array.length-1;i++) {
        if(array[i].fullname.split(/\s/)[1]===array[i+1].fullname.split(/\s/)[1]){
         array[i].amount = 0
         /*const clean = array.filter(item=>item.amount!==0)
         return clean*/
         }
    } 
}

function removeDoubleNameSum(array:oldData[]) {
    for (let i=0;i<array.length-1;i++){
        if(array[i].fullname===array[i+1].fullname){
            array[i+1].amount =array[i+1].amount + array[i].amount
            array[i].amount = 0;
            /*const clean = array.filter(item=>item.amount!==0)
            return clean*/
        }
    }
}

function removeDoubleDateSum(array:newData[]){
    for (let i=0;i<array.length-1;i++){
        if(array[i].date===array[i+1].date){
            array[i+1].amount = array[i].amount + array[i+1].amount
            array[i].amount = 0
            /*const clean = array.filter(item=>item.amount!==0)
            return clean*/
        }
    }
}

function getMaxValue(array:newData[]){
    const maxVal = array.map(item=>item.amount).reduce((max, prop)=>{
    if(prop>max){return prop}
    else {return max}
    },0)
    return maxVal
}

function getSum(total:number, number:number):number{
   return total+number}
   
function updateContragent(e:React.ChangeEvent<HTMLTextAreaElement>,_id:string){
     fetch('https://activities-server-db.herokuapp.com/merchants/update', {
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

export const Activity = ({someactivity, type, rangeAmount, rangeDate,color}:Activity1)=>{
    if(someactivity){
        const _someData:newData[] = structuredClone(someactivity)
        .sort((a:newData,b:newData)=> (a.fullname>b.fullname)?1:((a.fullname<b.fullname)?-1:0))
        if(!rangeDate){
            removeDoubleNameSum(_someData)}else{removeDoubleDateSum(_someData)
        }
        const someData = _someData.filter(item=>item.amount!==0)
        const maxVal = getMaxValue(someData)
        const perPixel = maxVal/400
        const totalAmount = someData.map(item=>item.amount).reduce(getSum,0)
        if(!rangeAmount&&!rangeDate){
            return(
                <div className = "wrapper">
                    <div style = {{marginTop:"25px" ,borderBottom:`2px solid ${color}`, marginBottom:"10px"}}><h3>{type} {totalAmount}</h3></div>
                   {someData.map((item:newData,i:number)=>
                    <li className = "activity" key = {i} >
                        <div>{item.fullname}</div>
                        <div>{item.amount}</div>
                        <div style = {{backgroundColor:`${color}`, width:`${item.amount/perPixel}px`, height:"20px"}}></div>
                    </li>)}
                </div>
            )
        }
        else 
        if(rangeAmount&&!rangeDate){
            return(
                <div className="wrapper">
                    <div style = {{borderBottom:`2px solid ${color}`, marginBottom:"10px"}}><h3>{type}</h3></div> 
                    {someData
                    .sort((a:newData,b:newData)=>(a.amount<b.amount)?1:(a.amount>b.amount)?-1:0)//))  
                    .map((item,i)=>
                    <li className = "activity" key = {i} >
                        <div>{item.fullname}</div>
                        <div>{item.amount}</div>
                        <div style = {{backgroundColor:`${color}`, width:`${item.amount/perPixel}px`, height:"20px"}}></div>
                    </li>)}
               </div>)
        }
        else 
        if(!rangeAmount&&rangeDate){
            return(
                <div className = "wrapper">
                    <div style = {{borderBottom:`2px solid ${color}`, marginBottom:"10px"}}><h3>{type}</h3></div>
                    {someData
                    .sort((a:newData,b:newData)=>(a.date>b.date)?1:(a.date<b.date)?-1:0)
                    .map((item,i)=>
                    <li className="activity"  key = {i} >
                        <div>{item.date} </div>
                        <div>{item.amount}</div>
                        <div style = {{backgroundColor:`${color}`, width:`${item.amount/perPixel}px`, height:"20px"}}></div>
                    </li>)}
                </div>)
        } else {return null}
    } else {return null} 
}

const PersonalActivity = ({type, activity, somearray,someref}:PersonalActivity1)=>{   
    const noteRef = useRef() as React.MutableRefObject<HTMLInputElement>
    if(somearray&&activity&&someref.current.value!=='') {
       return(
            <div>
                <div style = {{textTransform:"capitalize"}}>{type}:{activity}</div>
                {(somearray&&somearray.length!==0)?
                somearray.filter(item=>`${item.fullname}`===someref.current.value)
                        .filter(item=>item.type===`${type}`)
                        .sort((a,b)=>(a.date>b.date)?1:(a.date<b.date)?-1:0)
                        .map((item, i)=>
                            <li className = "showcontragent" key = {i} style ={{display:"grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
                                {item.date} : {item.amount}
                                <textarea style ={{position:"relative", top:"10px", left:"10px"}} 
                                        defaultValue = {item.question} 
                                        onMouseOver= {()=>noteRef.current.className = "comments1" } 
                                        onClick = {()=>noteRef.current.className = "comments"} 
                                        onMouseLeave={()=>noteRef.current.className = "comments" }
                                        onBlur = {(e)=>updateContragent(e,item._id)}>
                                </textarea>
                                <span ref = {noteRef} className = "comments">Change note?</span>
                            </li>)
                :null}
            </div>
        )
    } else {return null}
}

export const Contragent =({data, sumincome, sumoutcome, sumloans, suminvest, serverActivated}:Contragent1)=>{
    const [sumIncome0, setSumIncome0] = useState<number|null>()
    const [sumOutcome0, setSumOutcome0] = useState<number|null>()
    const [sumLoans0, setSumLoans0] = useState<number|null>()
    const [sumInvest0, setSumInvest0] = useState<number|null>()
    const [reg, setReg] = useState<string>('')

    const selectRef = useRef() as React.MutableRefObject<HTMLInputElement>

    function changeInput(e:React.ChangeEvent<HTMLInputElement>) {
        const reg1= e.target.value
        setReg(reg1)
        //console.log(reg)
    }
    const n = new RegExp(reg)

    function getPersonal(someData:newData[]|undefined,selectref:React.MutableRefObject<HTMLInputElement>):number|null{
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
        //console.log(incomes,outcomes,loans, investments)
        setSumIncome0(incomes)
        setSumOutcome0(outcomes)
        setSumLoans0(loans)
        setSumInvest0(investments)
    }

    if(data){
        let _someData:newData[]
        _someData = structuredClone(data).sort((a:newData,b:newData)=>(a.fullname>b.fullname)?1:((a.fullname<b.fullname)?-1:0))
        removeDoubleNameSum(_someData)
        const list = _someData.filter(item=>item.amount!==0)

        const sho = (_id:string) =>{
            console.log(list)
            const name1 = list.filter(item=>item._id===_id)
            selectRef.current.value=name1[0].fullname
            console.log(name1)
        }

        if(!selectRef.current){
            return (
                <div className = "wrapper">
                   <input ref = {selectRef} onChange = {changeInput}></input>
                    {list.map((item,i)=>
                        <li className = "showcontragent" key ={item._id} onClick = {()=>sho(item._id)}>{item.fullname}</li>)}
                        <button onClick ={showContragent}>Show</button>
                    </div>)
        } else {
            return (
                <div className = "wrapper">
                    <input  ref = {selectRef} onChange ={changeInput}></input>
                    {(list&&list.length!==0)?
                    list.filter(item=>n.test(item.fullname))
                        .map(item =>
                        <li className = "showcontragent" key ={item._id} onClick = {()=>sho(item._id)}>{item.fullname}</li>)
                        :null} 
                    <div> 
                        <button onClick ={showContragent}>Show</button>
                        <PersonalActivity type = "income" activity = {sumIncome0} somearray = {sumincome} someref = {selectRef}/>
                        <PersonalActivity type = "outcome" activity = {sumOutcome0} somearray = {sumoutcome} someref = {selectRef}/>
                        <PersonalActivity type = "loan" activity = {sumLoans0} somearray = {sumloans} someref = {selectRef}/>
                        <PersonalActivity type = "investment" activity = {sumInvest0} somearray = {suminvest} someref = {selectRef}/> 
                    </div>
                </div>)
                }
    } else {return null}
} 

export const Summary = ({sumincome, sumoutcome, sumloans, suminvest}:Summary1)=> {

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
              else { return prop}},0)
            return maxVal
        }
    }    
   
  const yu:number|any = gmv1(uu)
  console.log(yu)
     
     const GetSummary =({someData, trans}:getSummary) => {
        if(someData&&someData.length!==0){
            const totalCount = someData.length
            const totalAmount:any =someData.map((item)=>item.amount).reduce(getSum,0)
            console.log(totalAmount)
            return (
                <div className = "summaryclass">
                    <div className = "trans">{trans}</div>
                    <div>{totalCount}</div>
                    <div id ="color" style =  {{backgroundColor:(trans==="income")?"red":(trans ==="outcome")?"steelBlue":(trans ==="loan")?"yellow":"lightgreen", width:`${totalAmount/yu*400}px`, height:"20px"}}></div>
                    <div style ={{textAlign:"left"}}>{totalAmount}</div>
                </div>)
        } else {
            return (
                <div className = "summaryclass">
                    <div className = "trans">{trans}</div>
                    <div>-</div>
                    <div>No {trans} at this period</div>
                    <div>No</div>
                </div>
            )
        }
    }
    return(
      <div>
            <ul className = "summary">
                <li className="summaryheader"><h3> </h3><h3>Count</h3><h2>Summary</h2><h3>Amount</h3></li>
                <li><GetSummary someData = {sumincome} trans = "income"/></li>
                <li><GetSummary someData = {sumoutcome} trans = "outcome"/*}*//></li>
                <li><GetSummary someData = {sumloans} trans ="loan"/></li>
                <li><GetSummary someData = {suminvest} trans = "investment"/></li>
            </ul>
      </div>
    )
  }

export const Transaction=({data}:Transaction1)=>{
    const lnRef = useRef() as React.MutableRefObject<HTMLInputElement>
    const fnRef =  useRef()as React.MutableRefObject<HTMLInputElement>
    const amRef = useRef()as React.MutableRefObject<HTMLInputElement>
    const trRef = useRef() as React.MutableRefObject<HTMLSelectElement>
    const mailRef = useRef()as React.MutableRefObject<HTMLInputElement>
    const numRef = useRef()as React.MutableRefObject<HTMLInputElement>
    const adRef = useRef()as React.MutableRefObject<HTMLInputElement>
    const dateRef = useRef()as React.MutableRefObject<HTMLInputElement>
    const qRef = useRef()as React.MutableRefObject<HTMLTextAreaElement>
  
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
    fetch('https://activities-server-db.herokuapp.com/contragents',{
    method: "POST",
    headers: {
      "Content-Type": "application/json",/*; charset=UTF-8",*/ 
      },
    body:JSON.stringify({
      _id: v4(),
      fullname:`${lnRef.current.value} ${fnRef.current.value}`,
      date:dateRef.current.value,
      type:trRef.current.value.toLowerCase(),
      amount:amRef.current.value,
      email: mailRef.current.value,
      phone:numRef.current.value,
      address:adRef.current.value,
      question:qRef.current.value
      })
  })
    .then(response => {
          return response.text();
        })
        .then(data => {
          console.log(data)
        }).catch(err =>console.log(err));
    }
 /* async function createContragent(){
    const response = await fetch('https://activities-server-db.herokuapp.com/contragents', {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
        },
      body:JSON.stringify({
        _id: v4(),
        fullname:`${lnRef.current.value} ${fnRef.current.value}`,
        date:dateRef.current.value,
        type:trRef.current.value.toLowerCase(),
        amount:amRef.current.value,
        email: mailRef.current.value,
        phone:numRef.current.value,
        address:adRef.current.value,
        question:qRef.current.value
        })
    })
      const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };*/
  
  let  lastName:newData[],firstName:newData[];
    const lastname = (e:React.ChangeEvent<HTMLInputElement>) =>{
      const l1 = e.target.value
      setL(l1)
      console.log(l1)
      setViewLast(true)
      if(lastName&&lastName.length!==0){
        for (let i of lastName){
          if(e.target.value===i.fullname.split(/\s/)[0]||!ln.test(i.fullname.split(/\s/)[0])){setViewLast(false)}
            }
      }
    }
     
   const ln= new RegExp(l)
  
   const firstname = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const f1 = e.target.value
    const fn = new RegExp(f1)
    if(firstName&&firstName.length!==0){
      for (let i of firstName){
        if(e.target.value===i.fullname.split(/\s/)[1]||!fn.test(i.fullname.split(/\s/)[1])){setViewFirst(false)}
      }
    } 
   }
    if(data&&l){
        const lastName1 = data.filter(item=>ln.test(item.fullname.split(/\s/)[0])).sort((a,b)=>(a.fullname.split(/\s/)[0] > b.fullname.split(/\s/)[0]) ? 1 :((b.fullname.split(/\s/)[0] < a.fullname.split(/\s/)[0]) ? -1: 0))
        removeDoubleLast(lastName1)
        console.log(lastName1)
        lastName = lastName1.filter(item=>item.amount!==0)
        const firstName1 = data.filter(item=>item.fullname.split(/\s/)[0]===lnRef.current.value).sort((a,b)=>(a.fullname.split(/]s/)[1] > b.fullname.split(/\s/)[1]) ? 1 :((b.fullname.split(/\s/)[1] > a.fullname.split(/\s/)[1]) ? -1: 0))
        removeDoubleFirst(firstName1)
        firstName = firstName1.filter(item=>item.amount!==0)
       
       const onClickLast = (_id:string) =>{
       const name1 = lastName.filter(item=>item._id===_id)
       lnRef.current.value = name1[0].fullname.split(/\s/)[0]
       setViewFirst(true)
       setViewLast(false)
       firstName = lastName.filter(item=>lnRef.current.value===item.fullname.split(/\s/)[0])
                           .sort((a,b)=>(a.fullname.split(/\s/)[0] > b.fullname.split(/\s/)[0]) ? 1 :((b.fullname.split(/\s/)[0] > a.fullname.split(/\s/)[0]) ? -1: 0))
      } 
    
  
    const onClickFirst = (_id:string) =>{
        const name1 = firstName.filter(item=>item._id===_id)
        fnRef.current.value = name1[0].fullname.split(/\s/)[1]
        setViewFirst(false)
        const latestData0= data.filter(item=>(item.fullname.split(/\s/)[0]===lnRef.current.value&&item.fullname.split(/\s/)[1]===fnRef.current.value))
        .filter(item=>item.date<=dateRef.current.value)
        .sort((a,b)=>(a.date>b.date)?1:((b.date>a.date)?-1:0))
        const latestData = latestData0[latestData0.length-1]
        console.log(latestData0.length,latestData)
        mailRef.current.value = latestData.email;
        numRef.current.value = latestData.phone;
        adRef.current.value = latestData.address;
        setCheckbox(true)
        setViewInfo(false)
    }
        
      return(
        <div>
            <form className = "form" onSubmit ={submit} autoComplete = "off">  
              <div className="form-zvonok"> 
                <label>Transaction <span>*</span></label>
                <select name='transactiontype' ref ={trRef}>
                    <option>Income</option>
                    <option>Outcome</option>
                    <option>Loan</option>
                    <option>Investment</option>
                </select>
                <label>Date <span>*</span></label>
                <input type='date' name='date' ref = {dateRef} required/>
                <label>Last name <span>*</span></label>
                <input type='text' name='userlastname' ref = {lnRef} onChange = {lastname} required/>
                <ul className = {(viewLast)?"visiblement":"cached"}> {(lastName&&lastName.length!==0)?(lastName.map((item, i)=><li key = {i} onClick = {()=>onClickLast(item._id)}>{item.fullname.split(/\s/)[0]}</li>)):null}</ul>
                <label>First name <span>*</span></label>
                <input type='text' name='userfirstname' ref = {fnRef} onChange ={firstname} required/>
                <ul className = {(viewFirst)?"visiblement":"cached"}>{(firstName&&firstName.length!==0)?(firstName.map((item, i)=><li key = {i} onClick = {()=>onClickFirst(item._id)}>{item.fullname.split(/\s/)[1]}</li>)):null}</ul>
                <label>Amount <span>*</span></label>
                <input type='number' name='amount' ref = {amRef} required/>
                {<div className = {(!checkbox)?"cached":"visiblement_ info" }><label>Change personal data</label><input type = "checkbox"  onChange = {()=>setViewInfo(!viewInfo)}></input></div>}
                    <div className = {(viewInfo)?"info":"noinfo"}>
                        <label>E-mail <span>*</span></label>
                        <input type='text' name='usermail' ref = {mailRef}/>
                        <label>Phone <span>*</span></label>
                        <input type='text' name='usernumber' ref = {numRef}/>
                        <label>Address <span>*</span></label>
                        <input type='text' name='address'ref = {adRef}/>
                        <label>Notes</label>
                    </div>
                <textarea className = "text" name='question' ref = {qRef}/>
                <input className="bot-send-mail" type='submit' value='Send'/>
              </div>
            </form>
        </div>
      )} else {return(
        <div>
            <form className = "form" onSubmit ={submit} autoComplete = "off">  
              <div className="form-zvonok"> 
                <label>Transaction <span>*</span></label>
                <select name='transactiontype' ref ={trRef}>
                    <option>Income</option>
                    <option>Outcome</option>
                    <option>Loan</option>
                    <option>Investment</option>
                </select>
                <label>Date <span>*</span></label>
                <input type='date' name='date' ref = {dateRef} required/>
                <label>Last name <span>*</span></label>
                <input type='text' name='userlastname' ref = {lnRef} onChange = {lastname} required/>
                <label>First name <span>*</span></label>
                <input type='text' name='userfirstname' ref = {fnRef} onChange ={firstname} required/>
                <label>Amount <span>*</span></label>
                <input type='number' name='amount' ref = {amRef} required/>
                {<div className = {(!checkbox)?"cached":"visiblement_ info" }><label>Change personal data</label><input type = "checkbox"  onChange = {()=>setViewInfo(!viewInfo)}></input></div>}
                    <div className = {(viewInfo)?"info":"noinfo"}>
                        <label>E-mail <span>*</span></label>
                        <input type='text' name='usermail' ref = {mailRef}/>
                        <label>Phone <span>*</span></label>
                        <input type='text' name='usernumber' ref = {numRef}/>
                        <label>Address <span>*</span></label>
                        <input type='text' name='address'ref = {adRef}/>
                        <label>Notes</label>
                    </div>
                <textarea className = "text" name='question' ref = {qRef}/>
                <input className="bot-send-mail" type='submit' value='Send'/>
              </div>
            </form>
        </div>)
    } 
}

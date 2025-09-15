import { useState } from 'react'
import axios from 'axios'
import * as XLSX from "xlsx"

function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState("")
  const [emailList, setemailList] = useState([])

  function handlemsg(evt){
    setmsg(evt.target.value)
  }

  function send (){
    setstatus(true)
    axios.post("https://bulk-mail-h73k.onrender.com/sendemail", { msg, emailList })
    .then(function(data){
      if (data.data === true){
        alert("Email Sent Successfully")
        setstatus(false)
      }
      else{
        alert("Failed")
      }
    })
  }

  function handlefile(event){

    const file = event.target.files[0]
    console.log(file)

    const reader = new FileReader()

    reader.onload = function (event) {
        const data = event.target.result
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        const totalemail = emailList.map(function(item){return item.A})
        console.log(totalemail)
        setemailList(totalemail)
    }


    reader.readAsArrayBuffer(file)
  }

  return (
    <>
      <div className='bg-violet-950 text-white text-center'>
        <h1 className='text-2xl font-medium px-5 py-3'>BulkMail</h1>
      </div>

      <div className='bg-violet-800 text-white text-center'>
        <h1 className='font-medium px-5 py-3'>we can help you business with sending multiple emails at once</h1>
      </div>

      <div className='bg-violet-600 text-white text-center'>
        <h1 className='font-medium px-5 py-3'>Drag and Drop</h1>
      </div>

      <div className='bg-violet-400 flex flex-col items-center px-5 py-3'>
        <textarea onChange={handlemsg} value={msg} className='w-96 h-96 py-2 outline-none px-2 border-black rounded-md' placeholder='Enter your text here ...'></textarea>

        <div>
          <input type="file" onChange={handlefile} className='border border-dashed py-4 px-4 mt-5 mb-5' />
        </div>

        <p>Total Emails in the file: {emailList.length} </p>

        <button onClick={send} className='bg-blue-950 py-2 px-2 text-white font-medium rounded-md w-fit mt-2'>{status?"Sending":"Send"}</button>

      </div>

      
    </>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import Calendar from './calendar/Calendar'
import { format } from 'date-fns';


function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  function handleSetToday(){
    setSelectedDate(new Date());
  }
  return (
    <>
    <h1 className="mb-5 underline">WORK FROM OFFICE TRACKER</h1>
    <p>{format(selectedDate, "do MMM yyyy")}</p>
    <button className="text-sm mb-4 px-4 py-1 rounded text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800" onClick={handleSetToday}>Today</button>
    <div className="flex flex-col items-center">
      <Calendar selectedDate={selectedDate} changeSelectedDate={setSelectedDate}/>
    </div>
    </>
  )
}

export default App

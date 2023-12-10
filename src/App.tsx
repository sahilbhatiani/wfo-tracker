import { useState } from 'react'
import Calendar from './calendar/Calendar'
import { getConcatMonthYear } from './common';
import Stats from './Stats';


function App() {
  const [datesAttended, setDatesAttended] = useState(new Map<string, Array<number>>())
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leaveDates, setLeaveDates] = useState(new Map<string, Array<number>>())
  const disableDefaultRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.preventDefault();
  
  return (
    <div className='flex flex-col h-screen' onContextMenu={disableDefaultRightClick}>
      <h1 className="flex items-center justify-center underline font-mono text-2xl font-bold mt-10">WORK FROM OFFICE TRACKER</h1>
      <div className="h-full flex flex-row items-center justify-center gap-10 justify-self-center py-7 px-10">
        <Stats currentMonthAttendance={datesAttended.get(getConcatMonthYear(selectedDate))} selectedDate={selectedDate} currentMonthLeaves={leaveDates.get(getConcatMonthYear(selectedDate))}/>
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} datesAttended={datesAttended} setDatesAttended={setDatesAttended} leaveDates={leaveDates} setLeaveDates={setLeaveDates}/>
      </div>
    </div>
  )
}

export default App

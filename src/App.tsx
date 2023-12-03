import { useState } from 'react'
import './App.css'
import Calendar from './calendar/Calendar'
import { format, setDate } from 'date-fns';
import { getConcatMonthYear } from './common';
import Stats from './Stats';


type Props = {
  isSelectedDateAttended?:boolean
  handleDateAttended?: () => void;
  handleRemoveDateAttended?: () => void;
}
const AttendanceButton: React.FC<Props> = ({isSelectedDateAttended, handleDateAttended, handleRemoveDateAttended}) => {
  if(!isSelectedDateAttended){
    return <button className="text-sm mb-4 px-4 py-1 rounded text-white bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700" onClick={handleDateAttended}>Attended Office</button>
  }
  else{
    return <button className="text-sm mb-4 px-4 py-1 rounded text-white bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700" onClick={handleRemoveDateAttended}>Remove Attendance</button>
  }
}

function App() {
  let isSelectedDateAttended = false;
  const [datesAttended, setDatesAttended] = useState(new Map<string, Array<number>>())
  const [selectedDate, setSelectedDate] = useState(new Date());
  if(datesAttended.get(getConcatMonthYear(selectedDate))?.includes(selectedDate.getDate())){isSelectedDateAttended = true;}

  function handleSetToday(){
    setSelectedDate(new Date());
  }
  function handleDateAttended(){
    const monthYear = getConcatMonthYear(selectedDate);
    const dayOfMonth = selectedDate.getDate();
    let currMonthAttendedDates = datesAttended.get(monthYear);
    if(!!currMonthAttendedDates){
      if(!currMonthAttendedDates.includes(dayOfMonth)){
        currMonthAttendedDates.push(dayOfMonth);
      }
    }
    else{
      currMonthAttendedDates = [dayOfMonth];
    }
    setDatesAttended(map => new Map<string, Array<number>>(map.set(monthYear, currMonthAttendedDates ? currMonthAttendedDates:new Array<number>)));
  }
  function handleRemoveDateAttended(){
    const monthYear = getConcatMonthYear(selectedDate);
    const dayOfMonth = selectedDate.getDate();
    let currMonthAttendedDates = datesAttended.get(monthYear);
    currMonthAttendedDates = currMonthAttendedDates?.filter((x) => x!=dayOfMonth);
    setDatesAttended(map => new Map<string, Array<number>>(map.set(monthYear, currMonthAttendedDates ? currMonthAttendedDates:new Array<number>)));
  }
  function clearAttendance(){
    const monthYear = getConcatMonthYear(selectedDate);
    setDatesAttended(map => new Map<string, Array<number>>(map.set(monthYear, [])))
  }
  return (
    <>
    <h1 className="mb-5 underline">WORK FROM OFFICE TRACKER</h1>
    <p>{format(selectedDate, "do MMM yyyy")}</p>
    <div className='flex justify-center space-x-4'>
      <button className="text-sm mb-4 px-4 py-1 rounded text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800" onClick={handleSetToday}>Today</button>
      <AttendanceButton isSelectedDateAttended={isSelectedDateAttended} handleDateAttended={handleDateAttended} handleRemoveDateAttended={handleRemoveDateAttended}/>
      <button className="text-sm mb-4 px-4 py-1 rounded text-white bg-red-600 hover:bg-red-700 active:bg-red-800" onClick={clearAttendance}>Clear Attendance</button>
    </div>
    <div className="flex flex-row items-center justify-center gap-20">
      <Stats currentMonthAttendance={datesAttended.get(getConcatMonthYear(selectedDate))} selectedDate={selectedDate}/>
      <Calendar selectedDate={selectedDate} changeSelectedDate={setSelectedDate} datesAttended={datesAttended}/>
    </div>
    </>
  )
}

export default App

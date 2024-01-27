import { useState } from 'react'
import Calendar from './calendar/Calendar'
import { getConcatMonthYear } from './common';
import Stats from './Stats';
import AuthForm from './AuthForm';
import auth from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';


function App() {
  const [datesAttended, setDatesAttended] = useState(new Map<string, Array<number>>())
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leaveDates, setLeaveDates] = useState(new Map<string, Array<number>>())
  const disableDefaultRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.preventDefault();
  const [user] = useAuthState(auth)

  
  const handleSignOut = async () => {
    try{
        auth.signOut();
        window.location.reload();
    }
    catch(err){
        console.log(err)
    }
}

  return (
    <div className='flex flex-col align-center justify-center border h-screen'>
    {!user ? <AuthForm/> : 
    <div className='flex flex-col h-screen' onContextMenu={disableDefaultRightClick}>
      <div>
        <p>{auth.currentUser?.email}</p>
        <button id='btn-login border' className="w-40" onClick={handleSignOut}>Sign out</button>
        <h1 className="flex items-center justify-center underline font-mono text-2xl font-bold mt-10">WORK FROM OFFICE TRACKER</h1>
  `      <div className="h-full flex flex-row items-center justify-center gap-10 justify-self-center py-7 px-10">
  `        <Stats currentMonthAttendance={datesAttended.get(getConcatMonthYear(selectedDate))} selectedDate={selectedDate} currentMonthLeaves={leaveDates.get(getConcatMonthYear(selectedDate))}/>
          <Calendar user={user} selectedDate={selectedDate} setSelectedDate={setSelectedDate} datesAttended={datesAttended} setDatesAttended={setDatesAttended} leaveDates={leaveDates} setLeaveDates={setLeaveDates}/>
        </div>
      </div>
    </div>
    }
    </div>
  )
} 

export default App

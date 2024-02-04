import { useState} from 'react'
import Calendar from './calendar/Calendar'
import { AppTitle, DATES_ATTENDED_PATH, LEAVE_DATES_PATH, MyButton, getConcatMonthYear } from './common';
import Stats from './Stats';
import AuthForm from './AuthForm';
import auth, { db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import { datesConvertor } from './firestoreDB';


function App() {
  const [datesAttended, setDatesAttended] = useState(new Map<string, Array<number>>);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leaveDates, setLeaveDates] = useState(new Map<string, Array<number>>);
  const disableDefaultRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.preventDefault();
  const [user] = useAuthState(auth)
  const [msg, setMsg] = useState('')

  
const handleSignOut = async () => {
    try{
        auth.signOut();
        window.location.reload();
    }
    catch(err){
        console.error(err)
    }
}
const handleSubmitDates = async () => {
  try {
      const refLeaveDates = doc(db, `${user?.uid}/${LEAVE_DATES_PATH}`).withConverter(datesConvertor);
      await setDoc(refLeaveDates, leaveDates);
      const refDatesAttended = doc(db,`${user?.uid}/${DATES_ATTENDED_PATH}`).withConverter(datesConvertor);
      await setDoc(refDatesAttended, datesAttended);
      setMsg('Changes saved!')
  }
  catch(e){
      console.error("Error submitting leave dates: ", e);
      setMsg('There was an error. Changes not saved.')
  }
}

  return (
    <div className='flex flex-col align-center justify-center h-screen bg-slate-50 min-w-[800px]'>
    {!user ? <AuthForm/> : 
    <div className='flex flex-col h-screen' onContextMenu={disableDefaultRightClick}>
        <div className='flex flex-row place-content-between h-12 px-4 mt-2'>
          <AppTitle/>
          <div className='flex flex-row gap-2 items-center'>
            <p className='font-bold'>{user.email}</p>
            <MyButton color='slate' onClick={handleSignOut}>Sign Out</MyButton>
          </div>
        </div>
  `      <div className="h-full flex flex-row items-center justify-self-center justify-center gap-10">
  `       <Stats currentMonthAttendance={datesAttended.get(getConcatMonthYear(selectedDate))} selectedDate={selectedDate} currentMonthLeaves={leaveDates.get(getConcatMonthYear(selectedDate))}/>
          <div className='w-3/4 h-5/6 mb-14 relative max-w-7xl max-h-[650px] flex flex-col'>
            <div className='absolute top-[-40px] right-1/2 text-slate-800 font-semibold'>{msg}</div>
            <Calendar user={user} selectedDate={selectedDate} setSelectedDate={setSelectedDate} datesAttended={datesAttended} setDatesAttended={setDatesAttended} leaveDates={leaveDates} setLeaveDates={setLeaveDates} setMsg={setMsg}/>
            <MyButton className="place-self-center w-[100px] absolute bottom-[-80px] mb-5" color={"slate"} onClick={handleSubmitDates}>Save</MyButton>
          </div>
        </div>        
    </div>
    }
    </div>
  )
} 

export default App

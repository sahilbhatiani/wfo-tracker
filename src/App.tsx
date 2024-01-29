import { useState } from 'react'
import Calendar from './calendar/Calendar'
import { MyButton, getConcatMonthYear } from './common';
import Stats from './Stats';
import AuthForm from './AuthForm';
import auth, { db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc } from 'firebase/firestore';
import { datesConvertor } from './firestoreDB';


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
const handleSubmitDates = async () => {
  console.log("Submitting leave dates to firebase....")
  try {
      const ref = doc(db, `${user?.uid}/leaveDates`).withConverter(datesConvertor);
      await setDoc(ref, leaveDates)
  }
  catch(e){
      console.error("Error submitting leave dates: ", e);
  }

  console.log("Submitting attended dates to firebase....")
  try {
      const ref = doc(db,`${user?.uid}/datesAttended`).withConverter(datesConvertor);
      await setDoc(ref, datesAttended)
  }
  catch(e){
      console.error("Error submitting attended dates: ", e);
  }

}

  return (
    <div className='flex flex-col align-center justify-center border h-screen bg-slate-50'>
    {!user ? <AuthForm/> : 
    <div className='flex flex-col h-screen' onContextMenu={disableDefaultRightClick}>
        <div className='flex flex-row place-content-between h-12 px-4 mt-2'>

          <h1 className="flex items-center justify-center font-mono text-slate-800 text-2xl font-extrabold ">WORK FROM OFFICE TRACKER</h1>
          <MyButton color='slate' onClick={handleSignOut}>Sign Out</MyButton>
        </div>
  `      <div className="h-full flex flex-row items-center justify-self-center justify-center gap-10">
  `       <Stats currentMonthAttendance={datesAttended.get(getConcatMonthYear(selectedDate))} selectedDate={selectedDate} currentMonthLeaves={leaveDates.get(getConcatMonthYear(selectedDate))}/>
          <Calendar user={user} selectedDate={selectedDate} setSelectedDate={setSelectedDate} datesAttended={datesAttended} setDatesAttended={setDatesAttended} leaveDates={leaveDates} setLeaveDates={setLeaveDates}/>
        </div>        
        <MyButton className="place-self-center mb-10" color={"slate"} onClick={handleSubmitDates}>Submit</MyButton>
    </div>
    }
    </div>
  )
} 

export default App

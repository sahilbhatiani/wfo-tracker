import { useState} from 'react'
import Calendar from './calendar/Calendar'
import { AppTitle, MyButton, getConcatMonthYear } from './common';
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
        console.log(err)
    }
}
const handleSubmitDates = async () => {
  console.log("Submitting leave dates to firebase....")
  try {
      const ref1 = doc(db, `${user?.uid}/leaveDates`).withConverter(datesConvertor);
      await setDoc(ref1, leaveDates);
      const ref2 = doc(db,`${user?.uid}/datesAttended`).withConverter(datesConvertor);
      await setDoc(ref2, datesAttended);
      setMsg('Changes saved!')
  }
  catch(e){
      console.error("Error submitting leave dates: ", e);
      setMsg('There was an error. Changes not saved.')
  }
}

  return (
    <div className='flex flex-col align-center justify-center h-screen bg-slate-50 min-h-[400px] min-w-[600px]'>
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
          <div className='w-3/4 h-5/6 mb-14 relative'>
            <div className='absolute top-[-40px] right-1/2 text-slate-800 font-semibold'>{msg}</div>
            <Calendar user={user} selectedDate={selectedDate} setSelectedDate={setSelectedDate} datesAttended={datesAttended} setDatesAttended={setDatesAttended} leaveDates={leaveDates} setLeaveDates={setLeaveDates} setMsg={setMsg}/>
          </div>
        </div>        
        <MyButton className="place-self-center mb-5 mt-5" color={"slate"} onClick={handleSubmitDates}>Save</MyButton>
    </div>
    }
    </div>
  )
} 

export default App

import { getConcatMonthYear } from "../common";
import Cell from "./Cell"
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore"; 
import {format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay, endOfMonth, addYears, subYears, setDate, isWeekend } from "date-fns";
import { db } from "../firebase";
import { User } from "firebase/auth";
import firebase from "firebase/compat/app";
import { useEffect } from "react";

const datesConvertor = {
    toFirestore: (leaveDates: Map<string, Array<number>>) => {
        const customFirstoreObj: { [key: string]: Array<number> } = {};
        leaveDates.forEach((dates: Array<number>, monthYear:string) => {
            customFirstoreObj[monthYear] = dates;
        })
        return {customFirstoreObj};
    },
    fromFirestore: (snapshot: firebase.firestore.DocumentSnapshot, options: firebase.firestore.SnapshotOptions) => {
        const firestoreData = snapshot.data(options);
        if (!firestoreData) {
            // Return a default value or handle the case where data is not present
            return new Map<string, Array<number>>();
        }
        var leaveDates: Map<string, Array<number>> = new Map();
    
        for (const customFirstoreObj in firestoreData) {
            if (Object.prototype.hasOwnProperty.call(firestoreData, customFirstoreObj)) {
                const datesMap = firestoreData[customFirstoreObj];
                for(const monthYear in datesMap){
                    leaveDates.set(monthYear, datesMap[monthYear]);
                }
            }
        }
        return leaveDates;
    }
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
type Props = {
    user: User | null | undefined,
    selectedDate?: Date,
    setSelectedDate: (date: Date) => void,
    datesAttended: Map<string, Array<number>>,
    setDatesAttended: (datesAttended: Map<string, Array<number>>) => void,
    leaveDates: Map<string, Array<number>>,
    setLeaveDates: (leaveDates: Map<string, Array<number>>) => void
}

const Calendar: React.FC<Props> = ({user, selectedDate = new Date(), setSelectedDate, datesAttended, setDatesAttended, leaveDates, setLeaveDates}) => {
    const nextMonth = () => setSelectedDate(addMonths(selectedDate, 1));
    const prevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
    const nextYear = () => setSelectedDate(addYears(selectedDate, 1));
    const prevYear = () => setSelectedDate(subYears(selectedDate, 1));
    const numOfDays = getDaysInMonth(selectedDate);
    const firstDayOfMonth = getDay(startOfMonth(selectedDate));
    const lastDayOfMonth = getDay(endOfMonth(selectedDate));

    const handleClickDate = async (dayOfMonth: number, isRightClick: boolean = false, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const removeDayFromNonRelevantMonth = (dayOfMonth: number) => {
            if(nonRelevantMonthDates){
                if(nonRelevantMonthDates.includes(dayOfMonth)){
                    nonRelevantMonthDates = nonRelevantMonthDates.filter(day => day !== dayOfMonth)
                }
            }
        } 
        setSelectedDate(setDate(selectedDate, dayOfMonth));
        const monthYear = getConcatMonthYear(selectedDate);
        let relevantMonthDates = isRightClick ? leaveDates.get(monthYear) : datesAttended.get(monthYear)
        let nonRelevantMonthDates = isRightClick ? datesAttended.get(monthYear) : leaveDates.get(monthYear);
        if(isRightClick) event.preventDefault();

        if(relevantMonthDates){
          if(!relevantMonthDates.includes(dayOfMonth)){
            relevantMonthDates.push(dayOfMonth);
            removeDayFromNonRelevantMonth(dayOfMonth)
          }
          else{
            relevantMonthDates = relevantMonthDates.filter(day => day !== dayOfMonth);
        }
        }
        else{
          relevantMonthDates = [dayOfMonth];
          removeDayFromNonRelevantMonth(dayOfMonth)
        }
        if(isRightClick){
            setLeaveDates(new Map<string, Array<number>>(leaveDates.set(monthYear, relevantMonthDates ? relevantMonthDates:new Array<number>)));
            setDatesAttended(new Map<string, Array<number>>(datesAttended.set(monthYear, nonRelevantMonthDates ? nonRelevantMonthDates:new Array<number>)));
        }
        else{
            setDatesAttended(new Map<string, Array<number>>(datesAttended.set(monthYear, relevantMonthDates ? relevantMonthDates:new Array<number>)));
            setLeaveDates(new Map<string, Array<number>>(leaveDates.set(monthYear, nonRelevantMonthDates ? nonRelevantMonthDates:new Array<number>)));
        }
    }

    const handleSubmitDates = async () => {
        console.log("Submitting leave dates to firebase....")
        try {
            const ref = doc(db, user?.uid, "leaveDates").withConverter(datesConvertor);
            await setDoc(ref, leaveDates)
        }
        catch(e){
            console.error("Error submitting leave dates: ", e);
        }

        console.log("Submitting attended dates to firebase....")
        try {
            const ref = doc(db, user?.uid, "datesAttended").withConverter(datesConvertor);
            await setDoc(ref, datesAttended)
        }
        catch(e){
            console.error("Error submitting attended dates: ", e);
        }

    }

    

    useEffect(() => {
        console.log(`User uid ${user?.uid}`)
        const fetchLeaveDates = async () => {
            try {
                console.log("Trying to fetch data....")
                const ref = doc(db, user?.uid, "leaveDates").withConverter(datesConvertor);
                var docSnap = {}
                docSnap = await getDoc(ref);
                if(docSnap.data() !== undefined){
                    setLeaveDates(docSnap.data())
                }
                console.log(typeof(docSnap.data()));
              } catch (e) {
                console.error("Error fetching document: ", e);
            }
        }

        const fetchDatesAttended = async () => {
            try {
                console.log("Trying to fetch dates attended......")
                const ref = doc(db, user?.uid, "datesAttended").withConverter(datesConvertor);
                var docSnap = {}
                docSnap = await getDoc(ref);
                if(docSnap.data() !== undefined){
                    setDatesAttended(docSnap.data())
                }
                console.log(typeof(docSnap.data()));
              } catch (e) {
                console.error("Error fetching document: ", e);
            }
        }
        
        fetchLeaveDates();
        fetchDatesAttended();
        
    } , [])

    return (
        <>

            <div className="w-3/5 h-2/3 grid grid-cols-7">
                <Cell onClick={prevYear}>{"<<"}</Cell>
                <Cell onClick={prevMonth}>{"<"}</Cell>
                <Cell onClick={() => setSelectedDate(new Date())} className="col-span-3">{format(selectedDate, "LLLL yyyy")}</Cell>
                <Cell onClick={nextMonth}>{">"}</Cell>
                <Cell onClick={nextYear}>{">>"}</Cell>
                {daysOfWeek.map(day => 
                    <Cell key={day} className="text-sm font-bold">{day}</Cell>
                )}
                {Array.from(Array(firstDayOfMonth)).map((_, idx) => <Cell key={idx}> </Cell>)}
                {Array.from({length: numOfDays}, ((_, i) => {
                    const dayOfMonth = i + 1;
                    const isDateAttended = datesAttended?.get(getConcatMonthYear(selectedDate))?.includes(dayOfMonth);
                    const isLeaveDate = leaveDates.get(getConcatMonthYear(selectedDate))?.includes(dayOfMonth);
                    const isDayOfMonthToday = format(new Date(), 'd MMM y') === format(setDate(selectedDate, dayOfMonth), 'd MMM y');
                    return <Cell 
                        isDateAttended={isDateAttended}
                        isWeekend = {isWeekend(setDate(selectedDate, dayOfMonth))}
                        isLeaveDate = {isLeaveDate}
                        onClick={(event) => handleClickDate(dayOfMonth, false, event)} 
                        key={i}
                        onContextMenu={(event) => handleClickDate(dayOfMonth, true, event)}
                        >
                            {`${isDayOfMonthToday? `*${dayOfMonth}` : dayOfMonth}`}
                    </Cell>
                }))}
                {Array.from({length: 6-lastDayOfMonth}, ((_, i) => {return <Cell key={i}></Cell>}))}

            </div>
            <button className="border-2 border-black" onClick={handleSubmitDates}>Submit!</button>

        </>
    )
}

export default Calendar
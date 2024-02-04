import { DATES_ATTENDED_PATH, LEAVE_DATES_PATH, getConcatMonthYear } from "../common";
import Cell from "./Cell"
import { doc, getDoc} from "firebase/firestore"; 
import {format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay, endOfMonth, addYears, subYears, setDate, isWeekend } from "date-fns";
import { db } from "../firebase";
import { User } from "firebase/auth";
import { useEffect } from "react";
import { datesConvertor } from "../firestoreDB";
import HeaderCell from "./HeaderCell";


const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
type Props = {
    user: User | null | undefined,
    selectedDate?: Date,
    setSelectedDate: (date: Date) => void,
    datesAttended: Map<string, Array<number>>,
    setDatesAttended: (datesAttended: Map<string, Array<number>>) => void,
    leaveDates: Map<string, Array<number>>,
    setLeaveDates: (leaveDates: Map<string, Array<number>>) => void
    setMsg: (msg: string) => void;
}

const Calendar: React.FC<Props> = ({user, selectedDate = new Date(), setSelectedDate, datesAttended, setDatesAttended, leaveDates, setLeaveDates, setMsg}) => {
    const nextMonth = () => setSelectedDate(addMonths(selectedDate, 1));
    const prevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
    const nextYear = () => setSelectedDate(addYears(selectedDate, 1));
    const prevYear = () => setSelectedDate(subYears(selectedDate, 1));
    const numOfDays = getDaysInMonth(selectedDate);
    const firstDayOfMonth = getDay(startOfMonth(selectedDate));
    const lastDayOfMonth = getDay(endOfMonth(selectedDate));

    const handleClickDate = async (dayOfMonth: number, isRightClick: boolean = false, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setMsg('');
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
    
    useEffect(() => {
        const fetchLeaveDates = async () => {
            try {
                const refLeaveDates = doc(db, `${user?.uid}/${LEAVE_DATES_PATH}`).withConverter(datesConvertor);
                const docSnap = await getDoc(refLeaveDates);
                setLeaveDates(docSnap.data() ?? new  Map<string, Array<number>>)
              } catch (e) {
                console.error("Error fetching leaveDates: ", e);
            }
        }

        const fetchDatesAttended = async () => {
            try {
                const refDatesAttended = doc(db, `${user?.uid}/${DATES_ATTENDED_PATH}`).withConverter(datesConvertor);
                const docSnap = await getDoc(refDatesAttended);
                setDatesAttended(docSnap.data() ?? new  Map<string, Array<number>>)
              } catch (e) {
                console.error("Error fetching datesAttended: ", e);
            }
        }

        fetchLeaveDates();
        fetchDatesAttended();
    } , [])

    return (
        <>
            <header className="border-2 border-slate-700 col-span-7 grid grid-cols-7 bg-slate-700 shadow-2xl text-white cursor-pointer rounded-t-2xl w-full h-1/6">
                    <HeaderCell className="text-center rounded-tl-2xl" onClick={prevYear}>{"<<"}</HeaderCell>
                    <HeaderCell className="text-right" onClick={prevMonth}>{"<"}</HeaderCell>
                    <HeaderCell className="text-center col-span-3 text-lg" onClick={() => setSelectedDate(new Date())}>{format(selectedDate, "LLLL yyyy")}</HeaderCell>
                    <HeaderCell className="text-left" onClick={nextMonth}>{">"}</HeaderCell>
                    <HeaderCell className="text-center rounded-tr-2xl"    onClick={nextYear}>{">>"}</HeaderCell>
            </header>

            <div className="w-full h-full grid grid-cols-7 bg-white border-x-2 border-slate-700 border-b-2 shadow-2xl relative max-w-6xl">
                {daysOfWeek.map(day => 
                        <HeaderCell key={day} className="text-sm font-bold">{day}</HeaderCell>
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
        </>
    )
}

export default Calendar
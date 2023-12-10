import { getConcatMonthYear } from "../common";
import Cell from "./Cell"
import {format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay, endOfMonth, addYears, subYears, setDate, isWeekend } from "date-fns";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
type Props = {
    selectedDate?: Date;
    setSelectedDate: (date: Date) => void;
    datesAttended: Map<string, Array<number>>;
    setDatesAttended: (datesAttended: Map<string, Array<number>>) => void;
    leaveDates: Map<string, Array<number>>;
    setLeaveDates: (leaveDates: Map<string, Array<number>>) => void;
}

const Calendar: React.FC<Props> = ({selectedDate = new Date(), setSelectedDate, datesAttended, setDatesAttended, leaveDates, setLeaveDates}) => {
    const nextMonth = () => setSelectedDate(addMonths(selectedDate, 1));
    const prevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
    const nextYear = () => setSelectedDate(addYears(selectedDate, 1));
    const prevYear = () => setSelectedDate(subYears(selectedDate, 1));
    const numOfDays = getDaysInMonth(selectedDate);
    const firstDayOfMonth = getDay(startOfMonth(selectedDate));
    const lastDayOfMonth = getDay(endOfMonth(selectedDate));

    const handleClickDate = (dayOfMonth: number, isRightClick: boolean = false, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
                    return <Cell 
                        isDateAttended={isDateAttended}
                        isWeekend = {isWeekend(setDate(selectedDate, dayOfMonth))}
                        isLeaveDate = {isLeaveDate}
                        onClick={(event) => handleClickDate(dayOfMonth, false, event)} 
                        key={i}
                        onContextMenu={(event) => handleClickDate(dayOfMonth, true, event)}
                        >
                            {dayOfMonth}
                    </Cell>
                }))}
                {Array.from({length: 6-lastDayOfMonth}, ((_, i) => {return <Cell key={i}></Cell>}))}

            </div>

        </>
    )
}

export default Calendar
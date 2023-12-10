import { getConcatMonthYear } from "../common";
import Cell from "./Cell"
import {format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay, endOfMonth, addYears, subYears, setDate, isWeekend } from "date-fns";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
type Props = {
    selectedDate?: Date;
    setSelectedDate: (date: Date) => void;
    datesAttended: Map<string, Array<number>>;
    setDatesAttended: (datesAttended: Map<string, Array<number>>) => void;
    
}

const Calendar: React.FC<Props> = ({selectedDate = new Date(), setSelectedDate, datesAttended, setDatesAttended}) => {
    const nextMonth = () => setSelectedDate(addMonths(selectedDate, 1));
    const prevMonth = () => setSelectedDate(subMonths(selectedDate, 1));
    const nextYear = () => setSelectedDate(addYears(selectedDate, 1));
    const prevYear = () => setSelectedDate(subYears(selectedDate, 1));
    const numOfDays = getDaysInMonth(selectedDate);
    const firstDayOfMonth = getDay(startOfMonth(selectedDate));
    const lastDayOfMonth = getDay(endOfMonth(selectedDate));

    const handleClickDate = (dayOfMonth: number) => {
        setSelectedDate(setDate(selectedDate, dayOfMonth));
        const monthYear = getConcatMonthYear(selectedDate);
        let currMonthAttendedDates = datesAttended.get(monthYear);
        if(!!currMonthAttendedDates){
          if(!currMonthAttendedDates.includes(dayOfMonth)){
            currMonthAttendedDates.push(dayOfMonth);
          }
          else{
            currMonthAttendedDates = currMonthAttendedDates.filter(day => day !== dayOfMonth);
        }
        }
        else{
          currMonthAttendedDates = [dayOfMonth];
        }
        setDatesAttended(new Map<string, Array<number>>(datesAttended.set(monthYear, currMonthAttendedDates ? currMonthAttendedDates:new Array<number>)));
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
                    console.log(`${selectedDate} : ${isWeekend(selectedDate)}`)
                    return <Cell 
                        isDateAttended={isDateAttended}
                        isWeekend = {isWeekend(setDate(selectedDate, dayOfMonth))}
                        onClick={() => handleClickDate(dayOfMonth)} 
                        key={i}>
                            {dayOfMonth}
                    </Cell>
                }))}
                {Array.from({length: 6-lastDayOfMonth}, ((_, i) => {return <Cell key={i}></Cell>}))}

            </div>

        </>
    )
}

export default Calendar
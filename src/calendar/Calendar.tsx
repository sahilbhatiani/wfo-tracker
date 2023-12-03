import { getConcatMonthYear } from "../common";
import Cell from "./Cell"
import {format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay, endOfMonth, addYears, subYears, setDate } from "date-fns";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
type Props = {
    selectedDate?: Date;
    changeSelectedDate: (date: Date) => void;
    datesAttended?: Map<string, Array<number>>;
}

const Calendar: React.FC<Props> = ({selectedDate = new Date(), changeSelectedDate, datesAttended}) => {
    const nextMonth = () => changeSelectedDate(addMonths(selectedDate, 1));
    const prevMonth = () => changeSelectedDate(subMonths(selectedDate, 1));
    const nextYear = () => changeSelectedDate(addYears(selectedDate, 1));
    const prevYear = () => changeSelectedDate(subYears(selectedDate, 1));
    const numOfDays = getDaysInMonth(selectedDate);
    const firstDayOfMonth = getDay(startOfMonth(selectedDate));
    const lastDayOfMonth = getDay(endOfMonth(selectedDate));

    const handleClickDate = (dayOfMonth: number) => changeSelectedDate(setDate(selectedDate, dayOfMonth));
    
    return (
        <>
        <div className="w-[400px] border-t border-l">
            <div className="grid grid-cols-7 ">
                <Cell onClick={prevYear}>{"<<"}</Cell>
                <Cell onClick={prevMonth}>{"<"}</Cell>
                <Cell className="col-span-3">{format(selectedDate, "LLLL yyyy")}</Cell>
                <Cell onClick={nextMonth}>{">"}</Cell>
                <Cell onClick={nextYear}>{">>"}</Cell>
                {daysOfWeek.map(day => 
                    <Cell key={day} className="text-sm font-bold">{day}</Cell>
                )}
                {Array.from(Array(firstDayOfMonth)).map((_, idx) => <Cell key={idx}> </Cell>)}
                {Array.from({length: numOfDays}, ((_, i) => {
                    const dayOfMonth = i + 1;
                    const isSelectedDate = dayOfMonth === selectedDate.getDate();
                    const isDateAttended = datesAttended?.get(getConcatMonthYear(selectedDate))?.includes(dayOfMonth);
                    return <Cell 
                        isDateAttended={isDateAttended}
                        isActive={isSelectedDate} 
                        onClick={() => handleClickDate(dayOfMonth)} 
                        key={i}>
                            {dayOfMonth}
                    </Cell>
                }))}
                {Array.from({length: 6-lastDayOfMonth}, ((_, i) => {return <Cell key={i}></Cell>}))}

            </div>
        </div>
        </>
    )
}

export default Calendar
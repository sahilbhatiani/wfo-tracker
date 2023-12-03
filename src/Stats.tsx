import { eachWeekendOfMonth, getDaysInMonth } from "date-fns";

type Props = {
    currentMonthAttendance: number[];
    selectedDate: Date;
}

const Stats: React.FC<Props> = ({currentMonthAttendance, selectedDate}) => {
    const numberOfWeekendDays = eachWeekendOfMonth(selectedDate).length;
    const numberOfWorkingDaysInMonth = getDaysInMonth(selectedDate) - numberOfWeekendDays;
    const numberOfDaysAttended = currentMonthAttendance?.length;
    const currentAttendancePercentage = numberOfDaysAttended*100/numberOfWorkingDaysInMonth;
    const requiredAttendanceNumber = Math.ceil(0.5 * numberOfWorkingDaysInMonth)
    const requredDaysToCome = requiredAttendanceNumber - numberOfDaysAttended;
    return(
        <>
            <div className='border-2 border-black'>
                <p>{`Number of Days attended: ${numberOfDaysAttended}`}</p>
                <p>{`Total Number of working days in month: ${numberOfWorkingDaysInMonth}`}</p>
                <p>{`Current Attendance %: ${currentAttendancePercentage}`}</p>
                <p>{`Required Attendance is 50%`}</p>
                <p>{`Required number of days to come: ${requiredAttendanceNumber}`}</p>
                <p>{`${requredDaysToCome} more days to come in to meet 50%`}</p>
            </div>
        </>
    )
}

export default Stats;
import { eachWeekendOfMonth, getDaysInMonth } from "date-fns";

type Props = {
    currentMonthAttendance: number[] | undefined;
    selectedDate: Date;
}

const Stats: React.FC<Props> = ({currentMonthAttendance, selectedDate}) => {
    if(!currentMonthAttendance){currentMonthAttendance = []}
    const numberOfWeekendDays = eachWeekendOfMonth(selectedDate).length;
    const numberOfWorkingDaysInMonth = getDaysInMonth(selectedDate) - numberOfWeekendDays;
    const numberOfDaysAttended = currentMonthAttendance?.length;
    const currentAttendancePercentage = numberOfDaysAttended*100/numberOfWorkingDaysInMonth;
    const requiredAttendanceNumber = Math.ceil(0.5 * numberOfWorkingDaysInMonth)
    const requredDaysToCome = requiredAttendanceNumber - numberOfDaysAttended;
    return(
        <>
            <div className="w-50 stats stats-vertical shadow">
                <div className="stat">
                    <div className="stat-title">DAYS IN</div>
                    <div className="stat-value">{numberOfDaysAttended}</div>
                    <div className="stat-desc">{`Target: ${requiredAttendanceNumber}`}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">% IN</div>
                    <div className="stat-value">{`${currentAttendancePercentage.toFixed(1)}%`}</div>
                    <div className="stat-desc">{`Target: 50%`}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Leave + Holiday</div>
                    <div className="stat-value">{`${currentAttendancePercentage.toFixed(1)}%`}</div>
                    <div className="stat-desc">{`Target: 50%`}</div>
                </div>
            </div>
        </>
    )
}

export default Stats;
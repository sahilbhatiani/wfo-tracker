import clsx from "clsx";
import { eachWeekendOfMonth, getDaysInMonth } from "date-fns";

type Props = {
    currentMonthAttendance: number[] | undefined;
    selectedDate: Date;
    currentMonthLeaves: number[] | undefined;
}

const Stats: React.FC<Props> = ({currentMonthAttendance, selectedDate, currentMonthLeaves}) => {
    currentMonthLeaves = currentMonthLeaves ? currentMonthLeaves : [];
    if(!currentMonthAttendance){currentMonthAttendance = []}
    const numberOfWeekendDays = eachWeekendOfMonth(selectedDate).length;
    const numberOfWorkingDaysInMonth = getDaysInMonth(selectedDate) - numberOfWeekendDays - currentMonthLeaves.length;
    const numberOfDaysAttended = currentMonthAttendance?.length;
    const currentAttendancePercentage = numberOfDaysAttended*100/numberOfWorkingDaysInMonth;
    const requiredAttendanceNumber = Math.ceil(0.5 * numberOfWorkingDaysInMonth)
    return(
        <>
            <div className={clsx(
                "w-50 stats stats-vertical shadow no-scrollbar border-4 shadow-2xl border-slate-600 ",
                {'transition easy-linear ': currentAttendancePercentage >= 50},
                )}>
                <div className="stat ">
                    <div className="stat-title text-black">DAYS IN</div>
                    <div className={clsx(
                "stat-value",
                {'transition easy-linear text-green-600': currentAttendancePercentage >= 50}
                )}>{numberOfDaysAttended}</div>
                    <div className="stat-desc text-black">{`Target: ${requiredAttendanceNumber}`}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-black">% IN</div>
                    <div className= {clsx(
                "stat-value",
                {'transition easy-linear text-green-600': currentAttendancePercentage >= 50}
                )}>{`${currentAttendancePercentage.toFixed(1)}%`}</div>
                    <div className="stat-desc text-black">{`Target: 50%`}</div>
                </div>
                <div className="stat">
                    <div className="stat-title text-black">Leave + Holiday</div>
                    <div className="stat-value">{`${currentMonthLeaves.length}`}</div>
                </div>
            </div>
        </>
    )
}

export default Stats;
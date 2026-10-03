import { endOfMonth, format, isPast, isSameMonth } from "date-fns";
import { Prediction } from "./predict";

type Props = {
    predictions: Prediction[];
    selectedDate: Date;
}

const Predictions: React.FC<Props> = ({predictions, selectedDate}) => {
    return(
        <div className="w-50 border-2 shadow-2xl border-slate-600 bg-white text-black rounded-2xl p-4 flex flex-col gap-2">
            <div className="text-sm text-black">{`LIKELY IN (${isSameMonth(selectedDate, new Date()) ? 'REST OF ' : ''}${format(selectedDate, 'MMMM').toUpperCase()})`}</div>
            {predictions.length === 0 ? (
                <div className="text-sm text-slate-500">{isPast(endOfMonth(selectedDate)) ? 'This month is over.' : 'No likely office days predicted.'}</div>
            ) : (
                <ul className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                    {predictions.map(({date, probability}) => (
                        <li key={date.toISOString()} className="flex justify-between gap-4 text-sm">
                            <span className="font-semibold">{format(date, 'EEE d MMM')}</span>
                            <span className="text-slate-500">{`${Math.round(probability * 100)}%`}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Predictions;

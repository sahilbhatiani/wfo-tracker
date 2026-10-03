import { endOfMonth, format, isPast, isSameMonth } from "date-fns";
import { Forecast, PredictionReason } from "./predict";

const REASON_LABELS: Record<PredictionReason, string> = {
    usual: 'Usual day',
    swap: 'Swapped in for leave',
    target: 'Needed for 50% target',
};

type Props = {
    forecast: Forecast;
    selectedDate: Date;
}

const Predictions: React.FC<Props> = ({forecast, selectedDate}) => {
    const {predictions, accuracy} = forecast;
    return(
        <div className="w-50 border-2 shadow-2xl border-slate-600 bg-white text-black rounded-2xl p-4 flex flex-col gap-2">
            <div className="text-sm text-black">{`LIKELY IN (${isSameMonth(selectedDate, new Date()) ? 'REST OF ' : ''}${format(selectedDate, 'MMMM').toUpperCase()})`}</div>
            {predictions.length === 0 ? (
                <div className="text-sm text-slate-500">{isPast(endOfMonth(selectedDate)) ? 'This month is over.' : 'No likely office days predicted.'}</div>
            ) : (
                <ul className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                    {predictions.map(({date, reason}) => (
                        <li key={date.toISOString()} className="flex justify-between gap-4 text-sm">
                            <span className="font-semibold">{format(date, 'EEE d MMM')}</span>
                            <span className="text-slate-500">{REASON_LABELS[reason]}</span>
                        </li>
                    ))}
                </ul>
            )}
            {accuracy !== undefined && (
                <div className="text-xs text-slate-500">{`${Math.round(accuracy * 100)}% accurate over the last 8 weeks`}</div>
            )}
        </div>
    )
}

export default Predictions;

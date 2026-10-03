import { addDays, differenceInCalendarDays, endOfMonth, getDay, isWeekend, max, startOfDay, startOfMonth, subDays } from "date-fns";
import { getConcatMonthYear } from "./common";

export type Prediction = {
    date: Date;
    probability: number;
};

const LOOKBACK_DAYS = 84; // 12 weeks of history
const HALF_LIFE_DAYS = 28; // recent weeks count more than older ones
const MIN_HISTORY_DAYS = 10; // need at least two working weeks of data
const LIKELY_THRESHOLD = 0.5;

const isMarked = (dates: Map<string, Array<number>>, date: Date) =>
    !!dates.get(getConcatMonthYear(date))?.includes(date.getDate());

// Keys are `${month}${year}` where year is always the last 4 characters
const parseMonthYear = (key: string) => new Date(Number(key.slice(-4)), Number(key.slice(0, -4)), 1);

const getFirstAttendedDate = (datesAttended: Map<string, Array<number>>) => {
    let first: Date | undefined;
    datesAttended.forEach((days, key) => {
        if (!days.length) return;
        const monthStart = parseMonthYear(key);
        const candidate = new Date(monthStart.getFullYear(), monthStart.getMonth(), Math.min(...days));
        if (!first || candidate < first) first = candidate;
    });
    return first;
};

/**
 * Predicts which weekdays of the given month the user is likely to go into the office.
 * Only days from today onwards are predicted, so past months return nothing.
 * Each weekday (Mon-Fri) gets a recency-weighted attendance rate computed over the last
 * 12 weeks, ignoring weekends, leave days and days before the user started tracking.
 * Returns an empty array if there isn't enough history to make a prediction.
 */
export function predictOfficeDays(
    datesAttended: Map<string, Array<number>>,
    leaveDates: Map<string, Array<number>>,
    month: Date,
    today: Date = new Date(),
): Prediction[] {
    today = startOfDay(today);
    const firstAttended = getFirstAttendedDate(datesAttended);
    if (!firstAttended) return [];

    const attendedWeight = new Array(7).fill(0);
    const totalWeight = new Array(7).fill(0);
    let historyDays = 0;

    for (let daysAgo = 1; daysAgo <= LOOKBACK_DAYS; daysAgo++) {
        const date = subDays(today, daysAgo);
        if (date < firstAttended) break;
        if (isWeekend(date) || isMarked(leaveDates, date)) continue;
        const weight = Math.pow(0.5, daysAgo / HALF_LIFE_DAYS);
        const weekday = getDay(date);
        totalWeight[weekday] += weight;
        if (isMarked(datesAttended, date)) attendedWeight[weekday] += weight;
        historyDays++;
    }
    if (historyDays < MIN_HISTORY_DAYS) return [];

    const predictions: Prediction[] = [];
    const lastDay = endOfMonth(month);
    for (let date = max([today, startOfMonth(month)]); date <= lastDay; date = addDays(date, 1)) {
        if (isWeekend(date) || isMarked(leaveDates, date) || isMarked(datesAttended, date)) continue;
        const weekday = getDay(date);
        if (!totalWeight[weekday]) continue;
        const probability = attendedWeight[weekday] / totalWeight[weekday];
        if (probability >= LIKELY_THRESHOLD) predictions.push({ date, probability });
    }
    return predictions;
}

export const findPrediction = (predictions: Prediction[], date: Date) =>
    predictions.find(p => differenceInCalendarDays(p.date, date) === 0);

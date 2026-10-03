import { addDays, differenceInCalendarDays, differenceInCalendarWeeks, endOfMonth, getDay, isSameMonth, isWeekend, max, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { getConcatMonthYear } from "./common";

export type PredictionReason = 'usual' | 'swap' | 'target';

export type Prediction = {
    date: Date;
    reason: PredictionReason;
};

export type Forecast = {
    predictions: Prediction[];
    accuracy?: number; // share of recent weekdays the model would have called correctly
};

const LOOKBACK_DAYS = 84; // 12 weeks of history
const HALF_LIFE_DAYS = 28; // recent weeks count more than older ones
const MIN_HISTORY_DAYS = 10; // need at least two working weeks of data
const USUAL_DAY_THRESHOLD = 0.5;
const ALTERNATING_GAP = 0.7; // odd/even week rates must differ this much to count as an alternating pattern
const MIN_PARITY_SAMPLES = 4;
const TARGET_RATIO = 0.5; // matches the 50% target in Stats
const TARGET_MONTHS = 6;
const BACKTEST_WEEKS = 8;
const WEEK_OPTIONS = { weekStartsOn: 1 } as const;

type History = {
    isAttended: (date: Date) => boolean;
    isLeave: (date: Date) => boolean;
    firstAttended: Date;
};

type Model = {
    score: (date: Date) => number; // likelihood of going in on this date's weekday
    swapsForLeave: boolean; // whether the user moves a usual day elsewhere when it's a leave day
    meetsTarget: boolean; // whether the user usually hits the monthly target
};

const isMarked = (dates: Map<string, Array<number>>, date: Date) =>
    !!dates.get(getConcatMonthYear(date))?.includes(date.getDate());

// Keys are `${month}${year}` where year is always the last 4 characters
const parseMonthYear = (key: string) => new Date(Number(key.slice(-4)), Number(key.slice(0, -4)), 1);

const weekParity = (date: Date) => Math.abs(differenceInCalendarWeeks(date, new Date(2000, 0, 3), WEEK_OPTIONS)) % 2;

const weekdaysOf = (weekStart: Date) => Array.from({length: 5}, (_, i) => addDays(weekStart, i));

const isSameDay = (a: Date, b: Date) => differenceInCalendarDays(a, b) === 0;

const workingDaysInMonth = (month: Date, isLeave: (date: Date) => boolean) => {
    let count = 0;
    for (let date = startOfMonth(month); date <= endOfMonth(month); date = addDays(date, 1)) {
        if (!isWeekend(date) && !isLeave(date)) count++;
    }
    return count;
};

// Hides attendance on or after `cutoff` so past weeks can be replayed without peeking
function makeHistory(datesAttended: Map<string, Array<number>>, leaveDates: Map<string, Array<number>>, cutoff?: Date): History | undefined {
    const isVisible = (date: Date) => !cutoff || date < cutoff;
    let firstAttended: Date | undefined;
    datesAttended.forEach((days, key) => {
        const month = parseMonthYear(key);
        days.forEach(day => {
            const date = new Date(month.getFullYear(), month.getMonth(), day);
            if (isVisible(date) && (!firstAttended || date < firstAttended)) firstAttended = date;
        });
    });
    if (!firstAttended) return undefined;
    return {
        isAttended: date => isVisible(date) && isMarked(datesAttended, date),
        isLeave: date => isMarked(leaveDates, date),
        firstAttended,
    };
}

function learn(history: History, today: Date): Model | undefined {
    // Recency-weighted attendance per weekday, split by odd/even week to catch alternating patterns
    const attended = Array.from({length: 7}, () => [0, 0]);
    const total = Array.from({length: 7}, () => [0, 0]);
    const samples = Array.from({length: 7}, () => [0, 0]);
    let historyDays = 0;

    for (let daysAgo = 1; daysAgo <= LOOKBACK_DAYS; daysAgo++) {
        const date = subDays(today, daysAgo);
        if (date < history.firstAttended) break;
        if (isWeekend(date) || history.isLeave(date)) continue;
        const weight = Math.pow(0.5, daysAgo / HALF_LIFE_DAYS);
        const weekday = getDay(date);
        const parity = weekParity(date);
        total[weekday][parity] += weight;
        samples[weekday][parity]++;
        if (history.isAttended(date)) attended[weekday][parity] += weight;
        historyDays++;
    }
    if (historyDays < MIN_HISTORY_DAYS) return undefined;

    const rate = (a: number, t: number) => t ? a / t : 0;
    const score = (date: Date) => {
        const weekday = getDay(date);
        const [a0, a1] = attended[weekday];
        const [t0, t1] = total[weekday];
        const [n0, n1] = samples[weekday];
        if (n0 >= MIN_PARITY_SAMPLES && n1 >= MIN_PARITY_SAMPLES && Math.abs(rate(a0, t0) - rate(a1, t1)) >= ALTERNATING_GAP) {
            return weekParity(date) ? rate(a1, t1) : rate(a0, t0);
        }
        return rate(a0 + a1, t0 + t1);
    };

    // In past weeks where a usual day was leave, did the user go in on another day instead?
    let weeksWithLostDay = 0;
    let weeksSwapped = 0;
    for (let weekStart = subWeeks(startOfWeek(today, WEEK_OPTIONS), 1); weekStart >= subDays(today, LOOKBACK_DAYS) && weekStart >= startOfWeek(history.firstAttended, WEEK_OPTIONS); weekStart = subWeeks(weekStart, 1)) {
        const weekdays = weekdaysOf(weekStart);
        if (!weekdays.some(d => history.isLeave(d) && score(d) >= USUAL_DAY_THRESHOLD)) continue;
        weeksWithLostDay++;
        if (weekdays.some(d => !history.isLeave(d) && score(d) < USUAL_DAY_THRESHOLD && history.isAttended(d))) weeksSwapped++;
    }

    // Did the user hit the target in recent complete months?
    let monthsMet = 0;
    let monthsTracked = 0;
    for (let month = startOfMonth(subMonths(today, 1)); month > startOfMonth(history.firstAttended) && monthsTracked < TARGET_MONTHS; month = subMonths(month, 1)) {
        let daysIn = 0;
        for (let date = month; date <= endOfMonth(month); date = addDays(date, 1)) {
            if (history.isAttended(date)) daysIn++;
        }
        if (daysIn >= Math.ceil(TARGET_RATIO * workingDaysInMonth(month, history.isLeave))) monthsMet++;
        monthsTracked++;
    }

    return { score, swapsForLeave: weeksWithLostDay > 0 && weeksSwapped / weeksWithLostDay >= 0.5, meetsTarget: monthsTracked > 0 && monthsMet / monthsTracked >= 0.5 };
}

function forecast(history: History, model: Model, month: Date, today: Date): Prediction[] {
    const from = max([today, startOfMonth(month)]);
    const to = endOfMonth(month);
    if (from > to) return [];

    const isOpen = (date: Date) => date >= today && !isWeekend(date) && !history.isLeave(date) && !history.isAttended(date);
    const byScore = (a: Date, b: Date) => model.score(b) - model.score(a) || a.getTime() - b.getTime();
    const picked: Prediction[] = [];

    // Pick the user's usual days, moving any lost to leave onto the next most likely day if they tend to do that
    for (let weekStart = startOfWeek(from, WEEK_OPTIONS); weekStart <= to; weekStart = addDays(weekStart, 7)) {
        const weekdays = weekdaysOf(weekStart);
        const usual = weekdays.filter(d => isOpen(d) && model.score(d) >= USUAL_DAY_THRESHOLD);
        usual.forEach(date => picked.push({ date, reason: 'usual' }));
        if (!model.swapsForLeave) continue;
        const lostDays = weekdays.filter(d => history.isLeave(d) && model.score(d) >= USUAL_DAY_THRESHOLD).length;
        weekdays.filter(d => isOpen(d) && !usual.includes(d)).sort(byScore).slice(0, lostDays)
            .forEach(date => picked.push({ date, reason: 'swap' }));
    }
    const predictions = picked.filter(p => p.date >= from && p.date <= to);

    // Top up to the monthly target if the user usually meets it
    if (model.meetsTarget) {
        const required = Math.ceil(TARGET_RATIO * workingDaysInMonth(month, history.isLeave));
        let daysIn = predictions.length;
        for (let date = startOfMonth(month); date <= to; date = addDays(date, 1)) {
            if (history.isAttended(date)) daysIn++;
        }
        const pickedInWeek = (date: Date) => predictions.filter(p => differenceInCalendarWeeks(p.date, date, WEEK_OPTIONS) === 0).length;
        // Prefer likely days, spread across weeks that have fewer office days so far
        const weight = (date: Date) => (model.score(date) + 0.1) / (1 + pickedInWeek(date));
        for (; daysIn < required; daysIn++) {
            const candidates: Date[] = [];
            for (let date = from; date <= to; date = addDays(date, 1)) {
                if (isOpen(date) && !predictions.some(p => isSameDay(p.date, date))) candidates.push(date);
            }
            if (!candidates.length) break;
            predictions.push({ date: candidates.reduce((a, b) => weight(b) > weight(a) ? b : a), reason: 'target' });
        }
    }
    return predictions.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// Replays recent weeks, predicting each one using only the data before it
function backtest(datesAttended: Map<string, Array<number>>, leaveDates: Map<string, Array<number>>, today: Date) {
    let correct = 0;
    let total = 0;
    for (let weeksAgo = 1; weeksAgo <= BACKTEST_WEEKS; weeksAgo++) {
        const weekStart = subWeeks(startOfWeek(today, WEEK_OPTIONS), weeksAgo);
        const history = makeHistory(datesAttended, leaveDates, weekStart);
        const model = history && learn(history, weekStart);
        if (!history || !model) continue;
        const weekdays = weekdaysOf(weekStart);
        const months = isSameMonth(weekStart, weekdays[4]) ? [weekStart] : [weekStart, weekdays[4]];
        const predicted = months.flatMap(month => forecast(history, model, month, weekStart));
        weekdays.filter(date => !isMarked(leaveDates, date)).forEach(date => {
            if (predicted.some(p => isSameDay(p.date, date)) === isMarked(datesAttended, date)) correct++;
            total++;
        });
    }
    return total ? correct / total : undefined;
}

/**
 * Predicts which weekdays of the given month the user is likely to go into the office.
 * Learns how many days a week the user goes in and which days they prefer (including
 * alternating-week patterns), shifts days around leave, and tops up to the monthly target
 * if the user usually meets it. Only days from today onwards are predicted.
 */
export function predictOfficeDays(
    datesAttended: Map<string, Array<number>>,
    leaveDates: Map<string, Array<number>>,
    month: Date,
    today: Date = new Date(),
): Forecast {
    today = startOfDay(today);
    const history = makeHistory(datesAttended, leaveDates);
    const model = history && learn(history, today);
    if (!history || !model) return { predictions: [] };
    return {
        predictions: forecast(history, model, month, today),
        accuracy: backtest(datesAttended, leaveDates, today),
    };
}

export const findPrediction = (predictions: Prediction[], date: Date) =>
    predictions.find(p => isSameDay(p.date, date));

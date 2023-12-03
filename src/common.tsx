export function getConcatMonthYear(date: Date){
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${month}${year}`;
}
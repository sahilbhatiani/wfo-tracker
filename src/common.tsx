import clsx from "clsx";
import React from "react";

export function getConcatMonthYear(date: Date){
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${month}${year}`;
}

interface ButtonProps extends React.PropsWithChildren {
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    color?: string;
}

export const MyButton:React.FC<ButtonProps>  = ({className, onClick=undefined, color, children}) => {
    return (
        <button className={clsx(
            "p-1 text-white rounded-lg border-4",
            `bg-${color}-700 border-${color}-700 hover:bg-${color}-500 hover:border-${color}-500`,
            className
        )}
        onClick={onClick}>
            {children}
        </button>
    )
}

export const AppTitle = () => {
    return(
        <div className="flex flex-col font-mono text-slate-800 text-2xl font-extrabold gap-0 relative">
            <div>WORK FROM OFFICE TRACKER</div>
            <div className='text-right text-xs font-semibold relative top-[-5px]'>Created by Sahil Bhatiani</div>
        </div>
    )
}
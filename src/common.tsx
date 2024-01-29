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
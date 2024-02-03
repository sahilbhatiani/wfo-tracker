import clsx from 'clsx';

interface Props extends React.PropsWithChildren {
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    isWeekend?: boolean;
    isDateAttended?: boolean;
    isLeaveDate?: boolean;
    onContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Cell: React.FC<Props> = ({isDateAttended=false, isWeekend=false, className, children, onClick=undefined, onContextMenu=undefined, isLeaveDate}) => {
    return(
        <div 
            onClick={isWeekend ? undefined : onClick} 
            onContextMenu={isWeekend? undefined: onContextMenu}
            className={clsx(
                className,
                "flex items-center justify-center transition-colors h-full text-xl",
                {"bg-slate-200": isWeekend},
                {"": !isWeekend && !!onClick},
                )   
            }>
            {!isWeekend && !!onClick? <div className={clsx(
                'h-12 aspect-square flex items-center justify-center rounded-full shadow-2xl cursor-pointer',
                { "bg-emerald-400 font-medium text-white border-2 border-emerald-700 hover:bg-emerald-300": isDateAttended},
                {" bg-slate-300 border-slate-600 border-2 hover:bg-slate-200": isLeaveDate},
                {"hover:bg-slate-100": !isLeaveDate && !isDateAttended}
                )}>
                {children}
            </div> : children}
        </div>
    )
}

export default Cell;


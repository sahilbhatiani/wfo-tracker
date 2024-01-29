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
                "flex items-center justify-center transition-colors",
                className,
                {"bg-slate-200": isWeekend},
                {"cursor-pointer": !isWeekend && !!onClick},
                "h-full text-xl"
                )   
            }>
            {(!isWeekend && isDateAttended) || isLeaveDate ? <div className={clsx(
                'h-12 aspect-square flex items-center justify-center rounded-full border-2 absolute shadow-2xl',
                { "bg-emerald-400 font-medium text-white border-emerald-600": isDateAttended},
                {" bg-slate-300 border-slate-600": isLeaveDate}
                )}>
                {children}
            </div> : children}
        </div>
    )
}

export default Cell;

// React.ReactNode accepts the most inputs
// interface ReactNodeProps {
//     children: React.ReactNode;
//     className?: string;
//   }
  
//   const Cell = (props: ReactNodeProps) => {
//     return (
//     <div className={props.className}>
//         {props.children}
//     </div>)}
  
//   export default Cell;


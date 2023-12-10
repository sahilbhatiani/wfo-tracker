import clsx from 'clsx';

interface Props extends React.PropsWithChildren {
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    isWeekend?: boolean;
    isDateAttended?: boolean;
    isLeaveDate?: boolean;
    onContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Cell: React.FC<Props> = ({isDateAttended=false, isWeekend=false, className, children, onClick=undefined, onContextMenu, isLeaveDate}) => {
    return(
        <div 
            onClick={isWeekend ? undefined : onClick} 
            onContextMenu={onContextMenu}
            className={clsx(
                "h-12 flex items-center justify-center border-stone-300 transition-colors",
                {"cursor-pointer hover:bg-gray-100": !isWeekend && !isDateAttended &&!isLeaveDate && !!onClick}, className,
                {"cursor-pointer bg-cyan-400 text-white": !isWeekend && isDateAttended},
                {"bg-gray-200": isWeekend},
                {"cursor-pointer bg-gray-400": isLeaveDate},
                "h-full border text-xl"
                )
            }>
            {children}
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


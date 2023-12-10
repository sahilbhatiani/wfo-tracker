import clsx from 'clsx';

interface Props extends React.PropsWithChildren {
    className?: string;
    onClick?: () => void;
    isWeekend?: boolean;
    isDateAttended?: boolean;
}

const Cell: React.FC<Props> = ({isDateAttended=false, isWeekend=false, className, children, onClick}) => {
    return(
        <div 
            onClick={isWeekend ? undefined : onClick} 
            className={clsx(
                "h-12 flex items-center justify-center border-stone-300 transition-colors",
                {"cursor-pointer hover:bg-gray-100": !isWeekend && !isDateAttended}, className,
                {"cursor-pointer bg-cyan-400 text-white": !isWeekend && isDateAttended},
                {"bg-gray-200": isWeekend},
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


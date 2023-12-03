import clsx from 'clsx';

interface Props extends React.PropsWithChildren {
    className?: string;
    onClick?: () => void;
    isActive?: boolean;
    isDateAttended?: boolean;
}

const Cell: React.FC<Props> = ({isDateAttended=false, isActive=false, className, children, onClick}) => {
    return(
        <div 
            onClick={isActive ? undefined: onClick} 
            className={clsx(
                "h-12 flex items-center justify-center border-b border-r transition-colors",
                {"cursor-pointer hover:bg-gray-100": !isActive && !isDateAttended && !!onClick}, className,
                {"bg-blue-600 text-white": !!isActive}, 
                {"cursor-pointer bg-yellow-500 text-white": !!isDateAttended},
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


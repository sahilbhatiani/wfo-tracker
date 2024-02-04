import clsx from 'clsx';

interface Props extends React.PropsWithChildren {
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const HeaderCell: React.FC<Props> = ({className, children, onClick=undefined}) => {
    return(
        <div 
            onClick={onClick} 
            className={clsx(
                className,
                "flex items-center justify-center transition-colors h-full text-xl",
                {"cursor-pointer hover:bg-slate-500": !!onClick},
                )   
            }>
            {children}
        </div>
    )
}

export default HeaderCell;


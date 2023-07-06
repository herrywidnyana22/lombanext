'use client'

import clsx from "clsx"


interface CardItemProps{
    title: string
    icon: any
    value: string
    color: string
}

const CardItem: React.FC<CardItemProps> = ({
    title,
    icon: Icon,
    value,
    color
}) => {
  return (
    <div className="
        bg-white
        p-8
        rounded-lg
        hover:shadow-lg
        transition
    ">
        <div className="
            flex
            items-center
            gap-5
        ">
            <span className={clsx(`
                text-4xl
                text-white
                p-3
                rounded-full`,
                color
            )}>
                <Icon className="w-6 h-6 shrink-0 "/>
            </span>
            <div className="flex gap-1 flex-col">
                <h3 className="text-lg text-slate-400">{title}</h3>
                <h1 className="font-bold text-slate-700 text-3xl">{value}</h1>
            </div>
        </div>
        
    </div>
  )
}

export default CardItem
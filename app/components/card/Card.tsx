'use client'

import useCard from "@/app/hooks/useCard"
import CardItem from "./CardItem"

const Card = () => {
    const carditem = useCard()
    return (
    <div className="
        grid
        grid-cols-4
        gap-5
      ">
    {
        carditem.map((item, i) => (
            <CardItem
                key={i}
                title= {item.title}
                icon = {item.icon}
                color = {item.color}
                value = {item.value}
            />
        ))
    }
    </div>
    )
}

export default Card
'use client'

import Image from "next/image"
import Avatar from "./Avatar"
import { useState } from "react"
import MenuProfile from "./menu/MenuProfile"
import { Panitia } from "@prisma/client"

interface HeaderProps {
    user: Panitia | null
}

const Header: React.FC<HeaderProps> = ({user}) => {
    const [isClick, setIsClick] = useState(false)
    
    return (
    <>
        <div className="
            relative
            flex
            justify-between
            items-center
            mt-5
        ">
            <Image
                src="/images/icon.png"
                alt="logo"
                width={40}
                height={40}
            />
            <Avatar onClick={() => setIsClick(!isClick)}/>
            
        {
            isClick && <MenuProfile isClicked = {setIsClick} currentUser={user}/>
        }
        </div>
    </>
    )
}

export default Header
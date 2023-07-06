'use client'

import Link from "next/link"
import useRoute from "../../hooks/useRoute"
import clsx from "clsx"
import { Panitia } from "@prisma/client"

interface MenuProps{
    currentUser: Panitia | null
}

const Menu: React.FC<MenuProps> = ({currentUser}) => {
    const menuItem = useRoute(currentUser)
   
    return (
        <nav className="bg-white p-4 rounded-md">
            <ul 
                role="list" 
                className="
                    flex
                    items-center
                    space-y-1"
            >
            {
                menuItem && menuItem.map((item: any, i: number) => (
                    <div key={i} >
                        <li>
                            <Link
                                href={item.href}
                                className={clsx(`
                                    gap-3
                                    group
                                    rounded-md
                                    p-3
                                    mr-4
                                    leading-6
                                    text-sm
                                    font-bold`,
                                    item.active 
                                    ? "bg-blue-400 text-white"
                                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                                )}
                            >
                                {item.label}
                            </Link>
                        </li>
                    </div>
                ))
            }
            </ul>
        </nav>
    )
}

export default Menu
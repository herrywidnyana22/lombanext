import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Panitia, Role } from '@prisma/client'
import axios from 'axios'

const useRoute= (currentUser: Panitia | null) => {

    const pathName = usePathname()
    const role = currentUser?.role
    const [menuItem, setMenuItem] = useState<any>(null)
   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/menu")
                setMenuItem(response.data)
            } catch (error) {
                console.log(error);
            }
        }

        if(currentUser?.role === Role.PANITIA) {
            fetchData()
        }
    }, [currentUser?.role])
        
    const menuAdmin = useMemo(() =>
    [
        {
            label: "Panitia",
            href: `/dashboard/panitia`,
            active: pathName === `/dashboard/panitia`
        }, {
            label: "Peserta",
            href: `/dashboard/peserta`,
            active: pathName === `/dashboard/peserta`
        }, {
            label: "Kategori",
            href: `/dashboard/kategori`,
            active: pathName === `/dashboard/kategori`
        }, {
            label: "Pos",
            href: `/dashboard/pos`,
            active: pathName === `/dashboard/pos`
        }
    ], [pathName]) 

    const menuPanitia = useMemo(() =>
        menuItem && menuItem.flatMap((item: any) => 
            item.pos.map((posItem: any) => ({
                label: posItem.kategori.namaKategori,
                href: `/dashboard/${posItem.kategori.namaKategori.toLowerCase()}`,
                active: pathName === `/dashboard/${posItem.kategori.namaKategori.toLowerCase()}`
            }))
        ), 
    [menuItem, pathName])

        
    if(role === Role.ADMIN) return menuAdmin
    

    if(role === Role.PANITIA) return menuPanitia
}

export default useRoute


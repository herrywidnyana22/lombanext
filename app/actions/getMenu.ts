import { NextResponse } from "next/server";

import prisma from "@/app/libs/db"
import getCurrentUser from "./getCurrentUser";
import { Role } from "@prisma/client";


const getMenu = async() => {
    try {
        const currentUser = await getCurrentUser()
        if (currentUser && currentUser?.role !== Role.PANITIA) return new NextResponse('Unauthorized', { status: 401})

        const menuPanitia = await prisma.panitia.findMany({
            select:{
                id: true,
                namaPanitia: true,
                pos:{
                    select:{
                        id: true,
                        namaPos: true,
                        kategori:{
                            select:{
                                id: true,
                                namaKategori: true
                            }
                        }
                    }
                }
            },

            where:{
                id: currentUser?.id
            }

        })

        return NextResponse.json(menuPanitia)
        
    } catch (error: any) {
        console.log(error, "Gagal mendapatkan data menu")
        return new NextResponse("Gagal mendapatkan data menu...",{status: 500})
    }
}

export default getMenu
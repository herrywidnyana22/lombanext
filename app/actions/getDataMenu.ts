import { NextResponse } from "next/server"
import { PrismaClient, Role } from "@prisma/client"
import prisma from "@/app/libs/db"
import getCurrentUser from "./getCurrentUser"
import { format, formatURL } from "../libs/Formater"


const getDataMenu = async(menu: keyof PrismaClient | any) => {
    let data: any[]= []
    const currentUser = await getCurrentUser()
    const role = currentUser?.role

    if (role === Role.ADMIN) {
        try {
            switch (menu) {
                case "kategori":
                    data = await prisma.kategori.findMany({
                        include:{
                            pos:{
                                select:{
                                    id: true,
                                    namaPos: true,
                                    posFinish: true,
                                    panitia:{
                                        select:{
                                            id:true,
                                            namaPanitia: true
                                        }
                                    }
                                },
                                orderBy: {
                                    namaPos: 'asc'
                                }
                            },
                        }
                    })
                    break
                
                case "panitia":
                    data = await prisma.panitia.findMany({
                        select:{
                            id:true,
                            namaPanitia: true,
                            username: true,
                            role: true,
                            image: true,
                            pos:{
                                select:{
                                    id: true,
                                    namaPos: true,
                                    kategori: {
                                        select: {
                                            id: true,
                                            namaKategori: true
                                        }
                                    }
                                }
                            }
                        }
                    })
                break
                    
                default:
                    break;
            }
    
            
            return data
    
        } catch (error) {
            return []
        }
    }

    if (role === Role.PANITIA){
        const namaKategori = formatURL(menu)
        try {
            data = await prisma.peserta.findMany({
                select:{
                    id: true,
                    noPeserta: true,
                    waktu: true,
                    kategori:{
                        select:{
                            id: true,
                            namaKategori: true
                        }
                    },
                    pos:{
                        select:{
                            id: true,
                            namaPos: true
                        }
                    }
                },
                where:{
                    kategori:{
                        namaKategori: namaKategori
                    },
                }
            })

            return data
        } catch (error) {
            return []
        }
    }
}


export default getDataMenu
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import prisma from "@/app/libs/db"

export async function POST(req: Request){
    try {
        const body = await req.json()
        const { data, model, pos} = body

        let respon: any[]= []

        switch (model) {
            case "kategori":
                respon = await prisma.kategori.findMany({
                    select:{
                        id: true,
                        namaKategori: true
                    },

                    where:{
                        namaKategori: data
                    },
                })
                    
                break
            
            case "panitia":
                respon = await prisma.panitia.findMany({
                    select:{
                        id: true,
                        username: true
                    },

                    where:{
                        username: data
                    },
                })
                    
            break

            case "peserta":
                respon = await prisma.peserta.findMany({
                    select:{
                        id: true,
                        noPeserta: true
                    },

                    where:{
                        AND:[
                            {
                                noPeserta: data
                            }, {
                                posId:{
                                    hasSome: pos
                                }
                            }
                        ]
                    },
                })
                    
            break
                
            default:
                break;
        }


        if(respon.length === 0) {
            return new NextResponse (JSON.stringify({
                status: 'ok',
                code: '200'
            }))
        }
        
        return new NextResponse (JSON.stringify({
            status: 'duplicate',
            code: '409',
            data: respon
        }))

    } catch (error) {
        return []
    }
}
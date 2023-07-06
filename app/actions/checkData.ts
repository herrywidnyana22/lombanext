import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import prisma from "@/app/libs/db"

const checkData = async(name: keyof PrismaClient, data: string) => {
    let respon: any[]= []


    try {

        switch (name) {
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
                
            default:
                break;
        }

        


        // //@ts-ignore
        // data = await prisma[menu].findMany()       
        // // const data = await prisma.kategori.findMany()

        
        return respon

    } catch (error) {
        return []
    }
}


export default checkData
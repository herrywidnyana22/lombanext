// getPos by kategori name

import { NextResponse } from "next/server";

import prisma from "@/app/libs/db"
import { AlertMessage } from "@/app/types/alertMessage"
import getCurrentUser from "@/app/actions/getCurrentUser"
import { formatURL } from "../libs/Formater";


export async function getPos (kategoriUrl: any) {
    try {
        const namaKategori = formatURL(kategoriUrl)
       
        const getMenu = await prisma.pos.findMany({
            select:{
                id: true,
                namaPos: true
            },

            where:{
                kategori:{
                    namaKategori: namaKategori
                }
            }
        })
        // return NextResponse.json(getMenu)
        return getMenu

    } catch (error) {
        console.log(error, "Gagal mendapatkan data pos")
        return new NextResponse("Gagal mendapatkan data pos...",{status: 500})
    }
}

export async function getPosName(kategoriUrl: any) {
    try {
        const namaKategori = formatURL(kategoriUrl)
        const currentUser = await getCurrentUser()

        const getPosName = await prisma.pos.findFirst({
            select:{
                id: true,
                namaPos: true,
                kategori:{
                    select:{
                        namaKategori:true
                    }
                }
            },

            where:{
                AND:[{
                    kategori:{
                        namaKategori: namaKategori
                    },
                    panitiaId: currentUser?.id
                }]
            }
        })
        // return NextResponse.json(getPosName)
        return getPosName

    } catch (error) {
        console.log(error, "Gagal mendapatkan pos")
        return new NextResponse("Gagal mendapatkan pos...",{status: 500})
    }
}
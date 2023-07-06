import { NextResponse } from "next/server";
import { AlertMessage } from "@/app/types/alertMessage";

import prisma from "@/app/libs/db"

interface NamaPosInput {
  name: string
  finish: number | string | null
}


export async function GET(req: Request){
    try {
        const getPos = await prisma.pos.findMany({
            select:{
                id: true,
                namaPos: true,
                kategori:{
                    select:{
                        id: true,
                        namaKategori: true
                    }
                },
                panitia:{
                    select:{
                        id: true,
                        namaPanitia: true
                    }
                }
            }
        })

        console.log(getPos)
        return NextResponse.json(getPos)

    } catch (error) {
        console.log(error, "Gagal menemukan data pos")
        return new NextResponse(AlertMessage.getFailed,{status: 500})
    }
}
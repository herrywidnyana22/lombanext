import { NextResponse } from "next/server";
import { AlertMessage } from "@/app/types/alertMessage";

import prisma from "@/app/libs/db"

interface NamaPosInput {
  name: string
  finish: number | string | null
}

interface FormData {
  namaPos: NamaPosInput[]
  namaKategori: string
  jumlahPos: string | number
}


export async function GET(req: Request){
    try {
        const getKategori = await prisma.kategori.findMany({
            select:{
                id: true,
                namaKategori: true,
                pos: {
                    select:{
                        id: true,
                        namaPos: true,
                        panitia: {
                            select: {
                                id: true,
                                namaPanitia: true
                            }
                        }
                    },
                    orderBy:{
                        namaPos: 'asc'
                    }
                }
            } 
        })

        

        console.log(getKategori)
        return NextResponse.json(getKategori)

    } catch (error) {
        console.log(error, "Gagal menemukan data kategori")
        return new NextResponse(AlertMessage.getFailed,{status: 500})
    }
}

export async function POST(req: Request) {
    

    // body
    // {
    //     namaPos: [ { name: 'pos 1', finish: null }, { name: 'pos 2', finish: '1' } ],
    //     namaKategori: 'dewasa',
    //     jumlahPos: '2'
    // }

    try {
        const body: FormData = await req.json();
        // check current user role
    
        // check exist data
        // if(!currentUser?.role === "admin"){
        //     return new NextResponse('Unauthorized', { status: 401})
    
        // }
        const addKategori = await prisma.kategori.create({
            data: {
                namaKategori: body.namaKategori,
                pos:{
                    createMany:{
                        data: body.namaPos.map((data) => ({ 
                            namaPos: data.name,   
                            posFinish: data.finish == 1 ? true : false
                        }))
                    }
                }
            }
            
        })

        return NextResponse.json(addKategori)
        
    } catch (error: any) {
        console.log(error, "Gagal menambahkan data kategori")
        return new NextResponse(AlertMessage.addFailed,{status: 500})
    }
    
}

// delete all selected
export async function PATCH(req: Request){
    try {
        const body = await req.json()

        const deleteSelectedData = await prisma.kategori.deleteMany({
            where: {
                id:{
                    in: body.data
                }
            }
        })

        console.log(`Deleted data: ${JSON.stringify(deleteSelectedData)}`);
        return NextResponse.json(deleteSelectedData)

    } catch (error: any) {
        console.error(`Error deleting data: ${error}`);
        return new NextResponse(AlertMessage.removeFailed,{status: 500})
    }
}
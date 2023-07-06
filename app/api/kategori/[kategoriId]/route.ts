import { NextResponse } from "next/server";
import { AlertMessage } from "@/app/types/alertMessage";
import prisma from "@/app/libs/db"


interface kategoriParams{
    kategoriId: string
}


export async function GET(req: Request,{params}: {params: kategoriParams}) {
    try {
        const {kategoriId} = params
        const getKategori = await prisma.kategori.findUnique({
            where:{
                id: kategoriId
            },        

            include:{
                pos:{
                    select:{
                        id: true,
                        namaPos: true
                    }
                }
            }
        })

        return NextResponse.json(getKategori)

    } catch (error) {
        console.log(error, "Gagal menemukan data kategori")
        return new NextResponse(AlertMessage.getFailed,{status: 500})
    }
}

export async function PATCH(req: Request, {params}: {params: kategoriParams}) {
    try {
        const {kategoriId} = params
        const body = await req.json()
        const { data, deletePos, newpos } = body
        const posArray = data[0].pos

        console.log(body)
        // console.log(JSON.stringify(body))


        // REPSON
        // const body = {
        //     data: [
        //         {
        //         id: '647f1aa6cb890ffa39ac3906',
        //         namaKategori: 'Dewasa',
        //         createAt: '2023-06-06T11:38:13.863Z',
        //         updateAt: '2023-06-07T17:03:38.206Z',
        //         pos: [Array],
        //         panitia: []
        //         }
        //     ],
        //     deletePos: [],
        //     newpos: [
        //         { id: 'newpos-1', value: 'Pos 1', posFinish: false },
        //         { id: 'newpos-2', value: 'Pos 2', posFinish: false },
        //         { id: 'newpos-3', value: 'Pos 3', posFinish: true }
        //     ]
        // }

        const updateData = await prisma.kategori.update({
            where:{
                id: kategoriId
            },
            data:{
                namaKategori: data[0].namaKategori,
                
                pos: {
                    ...(deletePos.length > 0 && {
                        deleteMany: {
                            id: {
                                in: deletePos,
                            }
                        }
                    }),

                    ...(newpos.length > 0 && {
                        createMany: {
                            data: posArray.map((posItem: any) => {
                                if (posItem.id.startsWith('newpos-')) {
                                    return {
                                        namaPos: posItem.namaPos,
                                        posFinish: posItem.posFinish,
                                    }
                                }
                            })
                        }
                    }),

                    ...(posArray.length > 0 && {
                        updateMany: posArray.map((posdata: any) => {
                            if (!posdata.id.startsWith('newpos-')) {
                                return {
                                    where: { id: posdata.id },
                                    data: {
                                        namaPos: posdata.namaPos,
                                        posFinish: posdata.posFinish,
                                    }
                                }
                            }
                        })
                    })
                }
            }
        })


        console.log(body.deletePos[0])
        console.log(body.data[0].namaKategori)

        return NextResponse.json(updateData)
        
    } catch (error) {
        console.log(error, "Gagal mengupdate data kategori")
        return new NextResponse(AlertMessage.editFailed,{status: 500})
    }

}



export async function DELETE(req: Request, {params}: {params: kategoriParams}) {

    try {
        const {kategoriId} = params

        // const currentUser = await getCurrentUser()

        // if (!currentUser?.id) return new NextResponse("Unauthorize", { status: 500 })

        const deleteKategori = await prisma.kategori.delete({
            where:{
                id: kategoriId
            },
            include:{
                pos: true,
                
            }

        })
        
        return NextResponse.json(deleteKategori)

    } catch (error) {
        console.log(error, "Gagal menghapus data kategori")
        return new NextResponse(AlertMessage.removeFailed,{status: 500})
    }
}
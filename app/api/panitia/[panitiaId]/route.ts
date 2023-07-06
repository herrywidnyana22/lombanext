import { NextResponse } from "next/server";
import { AlertMessage } from "@/app/types/alertMessage";
import prisma from "@/app/libs/db"


interface PanitiaParams{
    panitiaId: string
}

// update
export async function PATCH(req: Request, {params}: {params: PanitiaParams}) {
    const { panitiaId } = params
    const body = await req.json()
    const { namaPanitia, username, pos } = body[0]
    pos.map((data: any) => console.log(data.id))
    // console.log(namaPanitia)
    try {

        // set null pos jaga panitia
        const setNullPos = await prisma.pos.updateMany({
            where:{
                panitiaId: panitiaId 
            },

            data:{
                panitiaId: null
            }
        })
        
        if(!setNullPos) return new NextResponse(
            AlertMessage.editFailed,{status: 500}
        )


        const updatePanitia = await prisma.panitia.update({
            where: {
                id: panitiaId
            },
            data: {
                namaPanitia: namaPanitia,
                username: username,
                pos: {
                    connect: pos.map((data: any) => ({
                        id: data.id   
                    }))
                }
            },
        });
        console.log(updatePanitia)
        return NextResponse.json(updatePanitia)

    } catch (error) {
        console.log(error, "Gagal mengupdate data kategori")
        return new NextResponse(AlertMessage.editFailed,{status: 500})
    }
}

// delete
export async function DELETE(req: Request, { params } : { params: PanitiaParams}) {
    try {
        const { panitiaId } = params
        console.log(panitiaId)
        
        const deletePanitia = await prisma.panitia.delete({
            where:{
                id: panitiaId
            },
            include:{
                pos: true
            }
        })

        return NextResponse.json(deletePanitia)

    } catch (error) {
        console.error(`error deleting data ${error}`)
        return new Response(AlertMessage.removeFailed, { status: 500 })

    }
}
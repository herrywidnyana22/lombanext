import { NextResponse } from "next/server";
import { AlertMessage } from "@/app/types/alertMessage";
import prisma from "@/app/libs/db"


interface PesertaParams{
    pesertaId: string
}



// delete
export async function DELETE(req: Request, { params } : { params: PesertaParams}) {
    try {
        const { pesertaId } = params
        console.log(pesertaId)

        let deletePeserta

        const cekNoPeserta =  await prisma.peserta.findFirst({
            where: {
                id: pesertaId
            }
        })

        const cekPos = await prisma.pos.findFirst({
            where:{
                pesertaId:{
                    hasSome: pesertaId
                }
            }
        })

        if(cekNoPeserta && cekNoPeserta.posId.length === 1){
            deletePeserta = await prisma.peserta.delete({
                where:{
                    id: pesertaId
                }
            })
        }

         if(cekNoPeserta && cekNoPeserta.posId.length > 1){
            deletePeserta = await prisma.peserta.update({
                data:{
                    pos:{
                        disconnect:{
                            id: cekPos?.id
                        }
                    }
                },
                where:{
                    id: pesertaId
                },
            })
        }
        

        return NextResponse.json(deletePeserta)

    } catch (error) {
        console.error(`error deleting data ${error}`)
        return new Response(AlertMessage.removeFailed, { status: 500 })

    }
}
import { NextResponse } from "next/server";
import { AlertMessage } from "@/app/types/alertMessage";
import prisma from "@/app/libs/db"
import { Role } from "@prisma/client";
import { formatURL } from "@/app/libs/Formater";
import getCurrentUser from "@/app/actions/getCurrentUser";


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
                    hasSome: [pesertaId]
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

export async function GET(req: Request, { params } : { params: PesertaParams}) {
    const {pesertaId} = params
    const menuName = pesertaId
    
    let data
    const currentUser = await getCurrentUser()
    const role = currentUser?.role

    if (role === Role.ADMIN) {
        try {
            switch (menuName) {
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
    
            
            return NextResponse.json(data)
    
        } catch (error) {
            return NextResponse.json(null)
        }
    }

    if (role === Role.PANITIA){
        const namaKategori = formatURL(menuName)
        console.log(namaKategori)
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
            
            return NextResponse.json(data)
        } catch (error) {
            return NextResponse.json(null)
        }
    }
}
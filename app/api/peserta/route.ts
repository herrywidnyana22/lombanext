import { NextResponse } from "next/server";

import prisma from "@/app/libs/db"
import { AlertMessage } from "@/app/types/alertMessage";
import getCurrentUser from "@/app/actions/getCurrentUser";

// interface PesertaData {
//   noPeserta: {
//     [key: string]: string;
//   };
//   kategori: string;
// }

export async function POST(req: Request) {
    const requestData = await req.json()
    // const { noPeserta, kategori, inputPeserta } = requestData
    const { inputPeserta, kategori, isPosFinish} = requestData
    const currentUser: any = await getCurrentUser()
    const decodedKategoriName = decodeURIComponent(kategori);

    const posItem = currentUser?.pos.find(
        (pos: any) =>
        pos.kategori.namaKategori.toLowerCase() === decodedKategoriName.toLowerCase()
    )

    const kategoriId = posItem ? posItem.kategori.id : "";
    const posId = posItem ? posItem.id : ""

    console.log(kategori)
    console.log(inputPeserta)


    try {
        const newPesertas = await Promise.all(inputPeserta.map(async(noPeserta: any) => {
            if(noPeserta[noPeserta.id]){
                const cekNoPeserta =  await prisma.peserta.findFirst({
                    where: {
                        AND:[{
                            noPeserta: String (noPeserta[noPeserta.id])
                        }, {
                            kategoriId: kategoriId
                        }]
                    }
                })
    
    
                if(cekNoPeserta){

                    const updatePeserta: any = {
                        pos: {
                            connect: {
                                id: posId,
                            }
                        }
                    }

                    if(isPosFinish) {
                        updatePeserta.waktu = noPeserta.time
                    } else {
                        updatePeserta.waktu = "00:00:00:000"
                    }

                    return await prisma.peserta.update({
                        data: updatePeserta,
                        where:{
                            id:cekNoPeserta.id
                        }
                    })
    
                } else {
                    
                    return await prisma.peserta.create({
                        data: {
                            noPeserta: noPeserta[noPeserta.id],
                            kategori: {
                                connect: {
                                    id: kategoriId,
                                }
                            },
                            pos: {
                                connect: {
                                    id: posId,
                                }
                            },
                            waktu: noPeserta.time
                        },
                        include:{
                            pos: true,
                            kategori: true
                        }
                    })
                }
            }

        }))

        
        return NextResponse.json(newPesertas)

    } catch (error) {
        console.log(error);
        return new NextResponse(AlertMessage.addFailed, { status: 500 });
    }
}

export async function PATCH(req: Request){
    const body = await req.json()
    const { data, posId } = body
    console.log(body)
    try {
        let deletePeserta
        for (const pesertaId of data){

            const cekNoPeserta =  await prisma.peserta.findFirst({
                where: {
                    id: pesertaId
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
                                id: posId
                            }
                        }
                    },
                    where:{
                        id: pesertaId
                    },
                })
            }
        }

        return NextResponse.json(deletePeserta)

    } catch (error) {
        console.error(`error deleting data ${error}`)
        return new NextResponse('Internal Error!', { status: 500 })
    }
}
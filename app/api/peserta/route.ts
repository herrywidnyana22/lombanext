import { NextResponse } from "next/server";

import prisma from "@/app/libs/db"
import { AlertMessage } from "@/app/types/alertMessage";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface PesertaData {
  noPeserta: {
    [key: string]: string;
  };
  kategori: string;
}

export async function POST(req: Request) {
    const requestData: PesertaData = await req.json();
    const { noPeserta, kategori } = requestData;
    const currentUser: any = await getCurrentUser();
    const decodedKategoriName = decodeURIComponent(kategori);
    const posItem = currentUser?.pos.find(
        (pos: any) =>
        pos.kategori.namaKategori.toLowerCase() === decodedKategoriName.toLowerCase()
    );
    const kategoriId = posItem ? posItem.kategori.id : "";
    const posId = posItem ? posItem.id : "";
    console.log(noPeserta)

    try {
        const newPesertas = await Promise.all(Object.keys(noPeserta).map(async(key: string) => {
            if(noPeserta[key]){
                const cekNoPeserta =  await prisma.peserta.findFirst({
                    where: {
                        AND:[{
                            noPeserta: String (noPeserta[key])
                        }, {
                            kategoriId: kategoriId
                        }]
                    }
                })
    
    
                if(cekNoPeserta){
                    return await prisma.peserta.update({
                        data:{
                            pos: {
                                connect: {
                                    id: posId,
                                }
                            }
                        },
                        where:{
                            id:cekNoPeserta.id
                        }
                    })
    
                } else {
                    
                    return await prisma.peserta.create({
                        data: {
                            noPeserta: noPeserta[key],
                            kategori: {
                                connect: {
                                    id: kategoriId,
                                }
                            },
                            pos: {
                                connect: {
                                    id: posId,
                                }
                            }
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
    console.log(body)
    try {
        let deletePeserta
        for (const pesertaId of body.data){

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
        }

        return NextResponse.json(deletePeserta)

    } catch (error) {
        console.error(`error deleting data ${error}`)
        return new NextResponse('Internal Error!', { status: 500 })
    }
}
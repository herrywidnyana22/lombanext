import { NextResponse, NextRequest } from "next/server";
import { AlertMessage } from "@/app/types/alertMessage"
import bcrypt from "bcrypt"
import prisma from "@/app/libs/db"

// GET Data
export async function GET(req: Request) {
    try {
        const getPanitia = await prisma.panitia.findMany({
            select:{
                id: true,
                namaPanitia: true,
                pos:{
                    select:{
                        id: true,
                        namaPos: true,
                        kategori: {
                            select:{
                                id: true,
                                namaKategori: true
                            }
                        }
                    }
                }
                
            }
        })

        return NextResponse.json(getPanitia)
        
    } catch (error) {
        console.log(error, "Gagal menemukan data panitia")
        return new NextResponse(AlertMessage.getFailed,{status: 500})
    }
}

// CREATE
export async function POST(req: Request){

    try {
        const data = await req.json()

        const {
            nama,
            username,
            password,
            confPassword,
            role,
        } = data
        let {namaKategori,posId} = data
        let addPanitia
        const hashedPass = await bcrypt.hash(password, 12)

        if (!nama || !username || !password) return new NextResponse('Missing info', { status: 400 })

        if (password !== confPassword) {
            return new NextResponse("Password dan konfirm password tidak sama",
            {status: 500})
        }

        const cekData = await prisma.panitia.findUnique({
            where:{
                username: username
            }
        })

        if(cekData) {
            return new NextResponse("Username sudah terdaftar", { status: 409 })
        }
        

        if(role === 'ADMIN') {

            addPanitia = await prisma.panitia.create({
                data: {
                    namaPanitia: nama,
                    username: username,
                    role: role,
                    hashPassword: hashedPass,
                    image: "null"
                }
            });
        } else {
            // Find existing kategori and pos records based on their IDs
            const existingKategori = await prisma.kategori.findMany({
                where: {
                    id: { in: namaKategori }
                }
            });

            const existingPos = await prisma.pos.findMany({
                where: {
                    id: { in: posId }
                }
            });

            // Check if all required kategori and pos records were found
            if (existingKategori && existingKategori.length !== namaKategori.length || existingPos.length !== posId.length) {
                throw new Error('One or more required kategori or pos records not found');
            }

            addPanitia = await prisma.panitia.create({
                data: {
                    namaPanitia: nama,
                    username: username,
                    role: role,
                    hashPassword: hashedPass,
                    image: "null",
                    pos: {
                        connect: existingPos.map(pos => ({ 
                            id: pos.id 
                        }))
                    }
                },
                include: {
                    pos: true,
                }
            });
        }

        return new NextResponse(JSON.stringify({ 
                data: addPanitia, 
                msg: AlertMessage.addSuccess
            }), { status: 200 }
        )

    } catch (error) {
        console.log(error, 'Registration_error')
        return new NextResponse('Internal Error!', { status: 500 })
    }
}

// delete all checked
export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const deleteSelectedData = await prisma.panitia.deleteMany({
            where:{
                id: {
                    in: body.data
                }
            }
        })

        return NextResponse.json(deleteSelectedData)

    } catch (error) {
        console.error(`error deleting data ${error}`)
        return new NextResponse('Internal Error!', { status: 500 })
    }
    
}


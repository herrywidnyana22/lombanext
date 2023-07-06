import prisma from "@/app/libs/db"

import getSession from "./getSession"

const getCurrentUser = async() =>{
    try {
        const session = await getSession()
        console.log(session)

        if (!session?.user?.name){ return null}

        const currentUser = await prisma.panitia.findUnique({
            select:{
                id: true,
                namaPanitia: true,
                username: true,
                role: true,
                image: true,
                pos:{
                    select:{
                        id: true,
                        namaPos: true,
                        kategori:{
                            select:{
                                id: true,
                                namaKategori: true
                            }
                        }
                    }
                }
            },
            where: {
                username: session.user.name as string
            }

        })

        if (!currentUser) return null

        return currentUser

    } catch (error) {
        console.log('get current user error')
        return null
    }
}

export default getCurrentUser


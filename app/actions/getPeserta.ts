import prisma from "@/app/libs/db"
import getCurrentUser from "./getCurrentUser"

const getPeserta = async() =>{

    try {
        const currentUser = getCurrentUser()
        const dataPeserta = await prisma
        
    } catch (error) {
        
    }
}
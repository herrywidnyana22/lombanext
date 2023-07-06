import { getServerSession } from "next-auth"
import { auth } from "../api/auth/[...nextauth]/route"

export default async function getSession(){
    return await getServerSession(auth)
}
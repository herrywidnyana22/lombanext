import { Role } from "@prisma/client"
import prisma from "@/app/libs/db"
import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"


export const auth: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: 'username', type: 'text' },
                password: { label:'password',type: 'password' }
            },

            async authorize (credentials) {
                if(!credentials?.username || !credentials?.password) {
                    throw new Error("Invalid credential..!")
                }

                const user = await prisma.panitia.findUnique({
                    where:{
                        username: credentials.username
                    }
                })

                if (!user || !user?.hashPassword) {
                    throw new Error("Invalid username..!")
                }

                const isPasswordTrue = await bcrypt.compare(
                    credentials.password,
                    user.hashPassword
                )

                if(!isPasswordTrue){
                    throw new Error("Invalid password..!")
                }


                const sessionUser = {
                    id: user.id,
                    name: user.username,
                    image: user.image,
                    role: user.role as Role
                }

                return sessionUser
            },
            
        })
    ],

    debug: process.env.MODE_ENV === 'development',
    session:{
        strategy: "jwt"
    },

    secret: process.env.NEXTAUTH_SECRET,

    
}

const handler = NextAuth(auth)

export { handler as GET, handler as POST }
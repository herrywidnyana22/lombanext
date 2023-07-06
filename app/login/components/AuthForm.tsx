'use client'

import Button from "@/app/components/Button"
import { Input } from "@/app/components/Input"
import { Loading } from "@/app/components/Loading"
import { useEffect, useState } from "react"
import { BsArrowBarRight } from "react-icons/bs"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { AlertMessage } from "@/app/types/alertMessage"

const AuthForm = () => {
    const session = useSession()

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
      if(session?.status === 'authenticated'){
        console.log("Authentication")
        router.push("/dashboard")
      }
    }, [session?.status, router])
    
    const onLogin =(e: any) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)

        signIn('credentials', {
            ...data,
            redirect: false
            // callbackUrl: "/dashboard"
        })
        .then((respon) =>{
            if(respon?.ok && !respon?.error){
                toast.success(AlertMessage.loginSuccess)
                router.push('/dashboard')
            } else {
                // @ts-ignore
                toast.error(respon.error)
            }
            console.log(respon)

        })
        .finally(() => setIsLoading(false))
    }

    return (
        <div className="
            mt-8
            sm:mx-auto
            sm:w-full
            sm:max-w-md
        ">
            <div className="
                shadow
                px-4
                py-8
                bg-white
                sm:rounded-lg
                sm:px-10
            ">
                <form 
                    className="space-y-6"
                    onSubmit={onLogin}
                >
                    <Input 
                        id="username"
                        name="username" 
                        label="Username"
                        type="text" 
                        disabled={isLoading}
                    />
                    <Input 
                        id="password"
                        name="password" 
                        label="Password"
                        type="password" 
                        disabled={isLoading}
                    />
                    <div className="flex justify-end">
                        <Button 
                            type='submit'
                            icon={isLoading ? Loading : BsArrowBarRight}
                            disabled={isLoading}
                            text={`Sign In`}
                        />
                    </div>
                </form>               
            </div>            
        </div>
        
    )
}

export default AuthForm
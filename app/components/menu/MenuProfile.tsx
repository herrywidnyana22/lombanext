
import { useRouter } from "next/navigation"
import { BiUserPlus, BiLogOutCircle, BiCategoryAlt } from "react-icons/bi"
import { ShowModal } from "../modal/Modal"
import FormAddKategori from "../form/FormAddKategori"
import FormAddPanitia from "../form/FormAddPanitia"
import { Panitia } from "@prisma/client"
import { signOut } from "next-auth/react"
import { Role } from "@prisma/client"

interface MenuProfileProps{
    isClicked?: any
    currentUser: Panitia | null
}

const MenuProfile:React.FC<MenuProfileProps> = ({isClicked, currentUser}) => {
    const rule = currentUser?.role

    return (
        <div className="
            absolute
            px-5 
            py-4
            rounded-xl
            top-12
            right-0
            bg-white 
            shadow-2xl
            z-10
            text-slate-600
        ">
            <div className="p-2 w-full text-right">
                <h1 className="font-bold">{currentUser?.namaPanitia}</h1>
                <span className="text-md font-light">{currentUser?.role}</span>
            </div>
            
        {
            rule === Role.ADMIN && 
            <>
                <hr />
                <div
                    onClick={() => {                    
                        ShowModal({
                            content: <FormAddPanitia/>, 
                            title: "Tambah Panitia"
                        })
                        isClicked(false)
                    }} 
                    className="
                        flex 
                        items-center 
                        gap-2 
                        hover:bg-gray-100 
                        py-2 
                        px-1 
                        rounded-md 
                        cursor-pointer
                    "
                >
                    <span className="text-blue-400 text-lg"><BiUserPlus/></span>
                    Tambah Panitia
                </div>
                <div
                    onClick={() => {
                        ShowModal({
                            content: <FormAddKategori/>, 
                            title:"Tambah Kategori Lomba"
                        })
                        isClicked(false)
                    }} 
                    className="
                        flex 
                        items-center 
                        gap-2 
                        hover:bg-gray-100 
                        py-2 
                        px-1 
                        rounded-md 
                        cursor-pointer
                    "
                >
                    <span className="text-violet-400 text-lg"><BiCategoryAlt/></span>
                    Tambah Kategori
                </div>
                <hr />
            </>

                
        }
            <div
                onClick={() => signOut()} 
                className="
                    flex 
                    items-center 
                    gap-2 
                    py-2 
                    px-1
                    mt-2 
                    rounded-md 
                    hover:bg-gray-100 
                    cursor-pointer
                "
            >
                <span className="text-rose-400 text-lg"><BiLogOutCircle/></span>
                Logout
            </div>
        </div>
    )
}

export default MenuProfile
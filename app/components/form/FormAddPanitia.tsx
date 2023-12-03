'use client'

import { BsSaveFill } from "react-icons/bs"
import { useEffect, useState } from "react"
import { InputTable, OptionInput } from "../Input/Input"
import { Input } from "../Input/Input3"
import Button from "../Button"
import axios from "axios"
import { toast } from "react-hot-toast"
import { ValidateMessage } from "@/app/types/validateMesssage"
import { AlertMessage } from "@/app/types/alertMessage"
import { Loading } from "../Loading"
import { formatForm } from "@/app/libs/Formater"
import { dataFormat } from "@/app/libs/Formater"
import { confirmPassValidate, requiredValidate, existValidate, usernameFormatValidate, passValidate } from "@/app/libs/validate"
import { Role } from "@prisma/client"
import clsx from "clsx"


const FormAddPanitia = () => {
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [kategoriData, setKategoriData] = useState<any[]>([])
    const [isAdminChecked, setAdminChecked] = useState<boolean>(false)
    const [selectedPos, setSelectedPos] = useState<any[]>([])
    const [panitiaData, setPanitiaData] = useState<any[]>([])
    const [validateMsg, setValidateMsg] = useState()
    const [pass, setPass] = useState("")

    const onSelectedPos = (kategoriId: string, posId: string) =>{
        // kosongkan dulu sesuai kategori
        selectedPos !== null && onRemovePos(kategoriId)

        // format objek {kategoriid: posId}
        const newObject = {[kategoriId]: posId}
        
        const duplicateObject = selectedPos.find(obj => obj[kategoriId] === posId)
        if(duplicateObject) return

        setSelectedPos(prev => [...prev, newObject])
    }
    
    const onRemovePos = (kategoriId: string) => {
        setSelectedPos(prev => 
            prev.filter(obj => Object.keys(obj)[0] !== kategoriId))
    }

    const onSubmit = async(e: any) =>{
        setIsLoading(true)
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = formatForm(formData)
        
        await axios
        .post("/api/panitia", data)
        .then((respon) => {
            toast.success(respon.data.msg)
        })
        .catch((error) => toast.error(error.response.data))
        .finally(() => {
            
            setIsLoading(false)
        })
    }

    const handleChange = () =>{
        setAdminChecked(!isAdminChecked)
    }

    async function getKategori(){
        try {
            const dataKategori = await axios.get("/api/kategori")
            setKategoriData(dataKategori.data)
        } catch (error) {
            toast.error(AlertMessage.getFailed+" pos")
        }
    }

    useEffect(() => {
        getKategori()
    }, [])      
    
    return (
        <form onSubmit={onSubmit} className="text-slate-600">
            <div className="
                grid 
                grid-cols-2 
                gap-6 
                text-left
            ">
                <Input 
                    id="nama"
                    name="nama" 
                    type="text"
                    label="Nama"
                    required
                    disabled={isLoading}
                    validateMsg={validateMsg}
                    onChange={(e) => requiredValidate({e, setValidateMsg, validateMsg, setIsError})}
                    isError={isError}
                />
                <Input
                    id="username"                   
                    name="username"                   
                    type="text"
                    label="Username"
                    required
                    disabled={isLoading}
                    validateMsg={validateMsg}
                    onChange={(e) => {
                        existValidate({e, model: "panitia", setValidateMsg, validateMsg, setIsError})
                        requiredValidate({e, setValidateMsg, validateMsg, setIsError})
                        usernameFormatValidate({e, setValidateMsg, validateMsg, setIsError})
                    }}
                    isError={isError}
                />
                <Input
                    id="password"
                    name="password" 
                    type="password"
                    label="Password"
                    required
                    disabled={isLoading}
                    validateMsg={validateMsg}
                    onChange={(e) => {
                        setPass(e.target.value)
                        requiredValidate({e, setValidateMsg, validateMsg, setIsError})
                        passValidate({e, setValidateMsg, validateMsg, setIsError})
                    }}
                    isError={isError}
                />
                <Input
                    id="confPassword" 
                    name="confPassword" 
                    type="password"
                    label="Confirm Password"
                    required
                    disabled={isLoading}
                    validateMsg={validateMsg}
                    onChange={(e) => {
                        requiredValidate({e, setValidateMsg, validateMsg, setIsError})
                        confirmPassValidate(e, pass, setValidateMsg, validateMsg, setIsError)
                    }}
                    isError={isError}
                />
                <div className="mt-5">
                    <label className="
                        leading-6
                        font-medium
                        text-sm
                        text-slate-600
                    ">
                        Role
                    </label>
                    <div className="
                        flex 
                        gap-3
                        items-center
                        mb-5
                    ">
                        <div className="
                            flex 
                            gap-1
                            items-center
                        ">
                            <input
                                id="admin"
                                value='ADMIN'
                                type="radio"
                                name="role"
                                
                                disabled={isLoading}
                                onChange={handleChange}
                            />
                            <label>
                                Admin
                            </label>
                        </div>
                        <div className="
                            flex 
                            gap-1
                            items-center
                        ">    
                            <input 
                                id="panitia"
                                value='PANITIA'
                                type="radio"
                                name="role"
                                defaultChecked={true}
                                disabled={isLoading}
                                onChange={handleChange}
                            />
                            <label>
                                Panitia
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            {
                !isAdminChecked && 
            <>
                <hr/>
                <h2 className="mt-5 text-left">Tugas Jaga</h2>
                <div className={clsx(`
                    flex
                    justify-between
                    border 
                    
                    mt-2
                    rounded-md
                    p-4`,
                    selectedPos.length > 0 
                    ? "border-gray-300 "
                    : "border-rose-500 "
                    
                )}>
                    <div className="
                        w-full
                        grid
                        grid-cols-3
                        gap-6
                    ">
                    {
                        kategoriData.map((kategori, i) =>(
                        <div key={i} className="flex flex-col">
                            <OptionInput
                                // name dan value tidak perlu, 
                                // karnea akan diambil dari radio pos

                                // value={kategori.id}
                                // name= "namaKategori"
                                checked={
                                    selectedPos.some((obj) => 
                                        Object.keys(obj).includes(kategori.id)
                                    )
                                } 
                                id="namaKategori"
                                type="checkbox"
                                label={kategori.namaKategori}
                                disabled={isLoading}
                                onChange={() => onRemovePos(kategori.id)}
                            />
                            <div className="ml-6">
                            {
                                kategori.pos.map((pos: any, index: number) =>(
                                    <OptionInput
                                        key={index}
                                        id="namaPos" 
                                        value={pos.id}
                                        checked={
                                            selectedPos.some(obj => 
                                                Object.values(obj).includes(pos.id))
                                        } 
                                        name={kategori.id}
                                        type="radio"
                                        label={pos.namaPos}
                                        disabled={isLoading || (pos.panitia !== null)}
                                        onChange={() => onSelectedPos(kategori.id, pos.id)}
                                    />
                                ))
                            }
                            </div>
                        </div>
                        ))
                    }

                        
                    </div>
                    
                </div>  
            </>
            }
            <hr className="my-5"/>
            <div className="w-full flex justify-center">
                <Button 
                    type="submit"
                    text="Submit"
                    className="mt-6 px-10"
                    disabled ={
                        isLoading 
                        || (validateMsg && Object.keys(validateMsg).length > 0)
                        || selectedPos.length === 0
                    }
                    icon={isLoading ? Loading : BsSaveFill }
                />
            </div>
        </form>
    )
}

export default FormAddPanitia
'use client'

import {Input1} from "../Input/Input1"
import Button from "../Button"
import axios from "axios"
import clsx from "clsx"
import Tooltip from "../Tooltip"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BsSaveFill } from "react-icons/bs"
import { toast } from "react-hot-toast"
import { Loading } from "../Loading"
import { InputPosComponent } from "@/app/interfaces/InputProps"
import { ValidateMessage } from "@/app/types/validateMesssage"
import { isDuplicate } from "@/app/libs/validate"
import { ValidateCss } from "@/app/css/validate"

const FormAddKategori = () => {

    const [jumlahPos, setJumlahPos] = useState<number>(0)
    const [fieldError, setFieldError] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [validateMsg, setValidateMsg] = useState([])
    const [kategoriMsg, setKategoriMsg] = useState("")
    const [duplicateIndexes, setDuplicateIndexes] = useState<any[]>([]);
    const [inputPos, setInputPos] = useState<InputPosComponent[]>([])
   
    
    // const onSubmit: SubmitHandler<FieldValues> = (data) =>{
    //     setIsLoading(true)

    //     axios
    //     .post("/api/kategori",data)
    //     .then((respon) => {
    //         console.log(respon) 
    //         toast.success("Kategori berhasil ditambahkan")
    //     })
    //     .catch(() => toast.error("Gagal menambahkan data..!"))
    //     .finally(() => {
    //         setJumlahPos(0)
    //         setIsLoading(false)
    //         reset()
    //     })
    // }

    // add input pos baru
    const handleJumlahPos = (e: any) => {
        const value = e.target.value
        setJumlahPos(parseInt(value))
        setInputPos([])
        for(let i=0; i<value; i++){
            const newInputComponent: InputPosComponent = {
                id: `namaPos-${i+1}`,
                name: `namaPos-${i+1}`,
                posFinish: false,
                value: "",
                panitia: null,
                error: [],
            };

            setInputPos((prevInputComponents) => [...prevInputComponents, newInputComponent])
        }
        
    }


    const onValidate = async (e: any) => {
        const { value, name } = e.target

        if(name === "namaKategori"){
            setKategoriMsg("")
            if(value === "" || value === null){
               return setKategoriMsg(ValidateMessage.required)
            }

            const cek = await isDuplicate(value, "kategori")
            setKategoriMsg(cek as string)

        } else {
            const updatedPos = inputPos.map((field: any) =>{
                field.error = []
                if(name === field.namaPos){
                    field.error = []

                    if (value === null || value.trim() === "") {
                        field.error.push(ValidateMessage.required)
                        
                    }
                    field.value = value
                }

                return field 
            })

            const posValues = updatedPos.map((field: any) => field.value)
    
            const duplicateValues = posValues.filter((value: any, i: number) => 
                value && posValues.indexOf(value) !== i
            )

            updatedPos.forEach((field: any) => {
                if(value !== ""){
                    field.error = []
                }
                
                if (duplicateValues.includes(field.value)) {
                    field.error.push(ValidateMessage.sameField)
                }
            })


            const hasError = updatedPos.some((pos: any) => pos.error.length > 0);
            setIsError(hasError);

            console.log(updatedPos)
            
            setInputPos(updatedPos)
        }


    }

     


    return (
        <form onSubmit={() => {} } noValidate>
            <div className="
                grid 
                grid-cols-2
                gap-4
                text-left
            ">
                <Input1
                    name="namaKategori"
                    type="text"
                    label="Nama Kategori"
                    disabled={isLoading}
                    validateMsg={kategoriMsg}
                    isError={kategoriMsg ? true : false}
                    onChange={(e) => onValidate(e)}
                />
                <Input1
                    type="number"
                    label="Jumlah Pos"
                    onChange ={handleJumlahPos}
                    disabled={isLoading}
                    
                />
                
            </div>
            {jumlahPos > 0 && (
            <div className="text-slate-600 flex flex-col text-left">
                <hr className="my-5"/>
                <h2 className="font-bold mb-2">Pos</h2>
                <div className="grid grid-cols-2 gap-4">
                {   
                    inputPos.map((field, i:number) => (
                    
                        <div 
                            key={i}
                            className="
                                relative
                                flex 
                                gap-2
                            "
                        >   
                            
                            <Tooltip text="Atur sebagai pos finish">
                                <input 
                                    type="radio"
                                    defaultChecked={jumlahPos === i + 1}
                                    disabled={isLoading}
                                    value={1}
                                    name="namapos"
                                />
                            </Tooltip>
                            <Input1
                                name={field.id}
                                type="text"
                                placeholder={`Nama Pos ke ${i+1}`}
                                disabled={isLoading}
                                required
                                validateMsg={field.error}
                                isError ={field.error && field.error.length > 0}
                                onChange={(e) => onValidate(e)}
                                value={field.value}
                            
                            />
                            
                        </div>
            
                ))}
                </div>
            </div>
            )}
            <hr className="my-5"/>
            <div className="flex justify-end">
                <Button 
                    text="Submit"
                    type="submit"
                    disabled = {isLoading || isError || (kategoriMsg ? true : false)}
                    icon={isLoading ? Loading : BsSaveFill }

                />
            </div>
        </form>
  )
}

export default FormAddKategori


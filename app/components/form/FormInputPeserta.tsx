'use client'

import { BsSaveFill } from "react-icons/bs"
import Button from "../Button"
import { Input } from "../Input"
import { useState } from "react"
import { Loading } from "../Loading"
import axios from "axios"
import toast from "react-hot-toast"
import { formatForm } from "@/app/libs/Formater"
import { AlertMessage } from "@/app/types/alertMessage"
import { VaidasiPeserta } from "@/app/libs/validate"
import { ValidateMessage } from "@/app/types/validateMesssage"

interface formInputProps{
    kategori: string
    posName?: any
}

const FormInputPeserta:React.FC<formInputProps> = ({kategori, posName}) => {
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // const [validateMsg, setValidateMsg] = useState<any>({})
    const [validateMsg, setValidateMsg] = useState<any>({"nopeserta1":["Data sudah ada..!", "tidak boleh sama"]})
    const [pesertaField, setPesertaField] = useState<{[key: string]: string}[]>([])

    const posId = posName.id
    const jumlahInput = 4
    const onSubmit = async(e: any) =>{
        setIsLoading(true)
        e.preventDefault()
        const formData = new FormData(e.target)
        const noPeserta = Object.fromEntries(formData)

        await axios.post("/api/peserta", {noPeserta, kategori })
        .then(() => {
            toast.success(AlertMessage.addSuccess)
        })
        .catch(() => toast.error(AlertMessage.addFailed))
        .finally(() => {
            setIsLoading(false)
        })
    
    }

    const cekDuplicate = (e: any) =>{
        const { value, name } = e.target
        const newField = {[name]: value}

        setPesertaField((prevData) => {
            const updatedField = [...prevData]
            const index = updatedField.findIndex((field) => field.hasOwnProperty(name))            
            
            if(index !== -1) {
                updatedField[index][name] = value
            } else {
                updatedField.push(newField)
            }
            const duplicateValues = updatedField.filter((field, index, arr) => {
                const values = Object.values(field)
                return arr.some((item, i) => i !== index && Object.values(item).includes(values[0]));
            })
            const isDuplicate = duplicateValues.length > 0
            const deleteDuplicateMsg = Object.fromEntries(
                Object.entries(validateMsg).filter(([key, value]) => value !== ValidateMessage.sameField)
            )

            setValidateMsg((prevMsg: any) => {
                // Step 1: Remove "exist" value from arrays in validateMsg
                const updatedMsg: any = Object.entries(prevMsg).reduce((acc: any, [key, value]) => {
                    if (Array.isArray(value)) {
                        const filteredValue = value.filter((item: any) => item !== ValidateMessage.sameField);
                        if (filteredValue.length > 0) {
                            acc[key] = filteredValue;
                        }
                    } else {
                        acc[key] = value;
                    }
                    return acc;
                }, {})

                // Step 2: Add fields from duplicateValues with ["exist"] value as an array
                duplicateValues.forEach((field: any) => {
                    const fieldName = Object.keys(field)[0]
                    updatedMsg[fieldName] = [ValidateMessage.sameField];
                });

                return updatedMsg;
            })


            console.log(duplicateValues)
            console.log(isDuplicate)

            return updatedField
        })

    }

    return (
        <form onSubmit={onSubmit}>
            {JSON.stringify(pesertaField)}
            {JSON.stringify(validateMsg)}
            <div className={`grid grid-cols-${jumlahInput} gap-5 mt-6 justify-center` }>
            {
                Array.from({length: jumlahInput}, (_, i) => (
                    <Input
                        key={i}
                        id={`nopeserta${i+1}`}
                        name={`nopeserta${i+1}`}
                        type='number'
                        label="No Peserta"
                        disabled= {isLoading}
                        onChange={(e) => {
                            VaidasiPeserta(e, "peserta", setValidateMsg, validateMsg, posId)
                            cekDuplicate(e)
                        }}
                        validateMsg={validateMsg}
                    />

                ))
            }
            </div>
            <div className="w-full flex justify-center">
                <Button 
                    type="submit"
                    text="Submit"
                    className="mt-6 px-10"
                    disabled ={isLoading || (validateMsg && Object.keys(validateMsg).length > 0)}
                    icon={
                        isLoading
                        ? Loading
                        : BsSaveFill
                    }
                />
            </div>
        </form>
    )
}

export default FormInputPeserta
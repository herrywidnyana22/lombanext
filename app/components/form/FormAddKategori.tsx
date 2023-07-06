'use client'

import Input from "../Input1"
import Button from "../Button"
import axios from "axios"
import clsx from "clsx"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { BsSaveFill } from "react-icons/bs"
import { useForm, SubmitHandler, FieldValues, useFieldArray } from "react-hook-form"
import { toast } from "react-hot-toast"
import Tooltip from "../Tooltip"
import { Loading } from "../Loading"

const FormAddKategori = () => {

    const [jumlahPos, setJumlahPos] = useState(0)
    const [fieldError, setFieldError] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [duplicateIndexes, setDuplicateIndexes] = useState<any[]>([]);

    const { 
        register, 
        handleSubmit,
        control,
        reset,
        watch,
        getValues,
        formState: { errors }
    } = useForm<FieldValues>()

    const { fields, append  } = useFieldArray({
        control,
        name: 'namaPos',
    });

    let array: any[] = []
    const watchNamaPos = watch("namaPos")

       
    const handleJumlahPosChange = (e: any) =>{
        const { value } = e.target;
        const pos =  Number(value)
        setJumlahPos(pos)

        //reset dulu input namaPos
        reset({ namaPos: [] })

        // baru loop berdasarkan jumlah pos
        Array.from({length: pos}, ()=> append({ name: ''}))

        // reset validasi
        setErrorMessage("")
        setIsError(false)
        setDuplicateIndexes([])
    }
    
    const onSubmit: SubmitHandler<FieldValues> = (data) =>{
        setIsLoading(true)

        axios.post("/api/kategori",data)
        .then((respon) => {
            console.log(respon) 
            toast.success("Kategori berhasil ditambahkan")
        })
        .catch(() => toast.error("Gagal menambahkan data..!"))
        .finally(() => {
            setJumlahPos(0)
            setIsLoading(false)
            reset()
        })
    }

    
    const handleChange = useCallback((value: string, path: string) => {
        // setDuplicateIndexes([]);
        // console.log("watchNamaPos : ",watchNamaPos)
        // const fieldName = path.substring(path.indexOf("[") + 1, path.indexOf("]"));

        // const allPos = watch("namaPos").map((pos: any) => pos.name);

        // const duplicate = allPos.filter(
        //     (posItem: any, index: number) => posItem === value && Number(fieldName) !== index
        // );

        // const duplicatesExist = duplicate.length > 0;

        // setDuplicateIndexes((prevIndexes) => {
        //     let updatedIndexes = [...prevIndexes];

        //     if (duplicatesExist) {
        //         updatedIndexes.push(Number(fieldName));
        //         setErrorMessage("Nilai tidak boleh sama");
        //     } else {
        //         const indexToRemove = updatedIndexes.indexOf(Number(fieldName));
        //         if (indexToRemove > -1) {
        //             updatedIndexes.splice(indexToRemove, 1);
        //         }
        //         setErrorMessage("");
        //     }

        //     return updatedIndexes;
        // });
        

        // // setDuplicateIndexes(duplicateIndexesCopy);

        // console.log("=====================================")
        // console.log("fieldname : ",path)
        // console.log("index onchange : ",fieldName)
        // console.log("apakah ganda? : ",duplicatesExist)
        // console.log("duplicate : ",duplicate)
        // // console.log("index yg sama : ",duplicateIndexesCopy)
        // console.log("duplicateIndexes : ",duplicateIndexes)
        // console.log("all pos : ",allPos)
        console.log("=====================================")

   

        
        
        const watchNamaPos = watch("namaPos")
        // for(let i=0; i<jumlahPos; i++){
        //     array[i]= getValues(`namaPos[${i}].name`)
        // }

        // cek form duplicate value
        for (let i = 0; i < jumlahPos; i++) {
            for (let j = i + 1; j < jumlahPos; j++) {
                if (i === j || watchNamaPos[i].name === "" || watchNamaPos[j].name === "") continue;
                if (watchNamaPos[i].name === watchNamaPos[j].name) 
                {
                    console.log("GANDA !!!")
                    setDuplicateIndexes(prevData => [...prevData, `namaPos[${j}].name`])
                    setDuplicateIndexes(prevData => [...prevData, `namaPos[${i}].name`])
                }
                
                console.log("j :",watchNamaPos[j].name)
                console.log("i :",watchNamaPos[i].name)
            }
        }
        console.log("=========================")
        console.log("all pos : ",watchNamaPos)
        console.log("duplicateIndexes : ",duplicateIndexes)
        console.log("jumlahPos : ",jumlahPos)

    // }
    },[duplicateIndexes, watch, jumlahPos])   


    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {isError ? "true" : "false"}
            <div className="
                grid 
                grid-cols-2
                gap-4
                text-left
            ">
                <Input
                    id="namaKategori"
                    register={register}
                    type="text"
                    label="Nama Kategori"
                    disabled={isLoading}
                    error={errors}
                />
                <Input
                    id="jumlahPos"
                    type="number"
                    register={register}
                    label="Jumlah Pos"
                    onChange ={handleJumlahPosChange}
                    disabled={isLoading}
                    error={errors}
                />
                
            </div>
            {jumlahPos > 0 && (
            <div className="text-slate-600 flex flex-col text-left">
                <hr className="my-5"/>
                <h2 className="font-bold mb-2">Pos</h2>
                <div className="grid grid-cols-2 gap-4">
                {   
                    fields.map((field: any, i) => (

                    <div 
                        key={field.id}
                        className="
                            relative
                            flex 
                            gap-2
                        "
                    > 
                        <Tooltip text="Atur sebagai pos finish">
                            <input 
                                {...register(`namaPos.[${i}].finish`)} 
                                type="radio"
                                defaultChecked={jumlahPos === i+1 }
                                disabled={isLoading}
                                value={1}
                                name="namapos"
                            />
                        </Tooltip>
                        <Input
                            id={`namaPos[${i}].name`}
                            type="text"
                            placeholder={`Nama Pos ke ${i+1}`}
                            disabled={isLoading}
                            register = {register}
                            validateMessage={errorMessage}
                            // isError={isError}
                            isError={isError || duplicateIndexes.includes(i)}
                            error={errors}
                            onChange={(e) => {
                                setDuplicateIndexes([]),
                                handleChange(e.target.value, `namaPos[${i}].name`)
                            }}
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
                    disabled = {isLoading || isError}
                    icon={isLoading ? Loading : BsSaveFill }

                />
            </div>
        </form>
  )
}

export default FormAddKategori


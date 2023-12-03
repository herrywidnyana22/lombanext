'use client'

import Button from "../Button"
import axios from "axios"
import toast from "react-hot-toast"
import TimeInput from "../Input/TimeInput"
import { BsSaveFill } from "react-icons/bs"
import { Input } from "../Input/Input3"
import { useEffect, useState } from "react"
import { Loading } from "../Loading"
import { AlertMessage } from "@/app/types/alertMessage"
import { existValidate, duplicateValidate, isGroupEmpty } from "@/app/libs/validate"
import { InputPesertaComponent, TimeFormat } from "@/app/interfaces/InputProps"
import { InputTimeProps } from "@/app/interfaces/InputProps"

interface formInputProps{
    kategori: string
    posName?: any
}

const initialTime: InputTimeProps = {
  hour: '',
  minute: '',
  second: '',
  millisecond: '',
}



const FormInputPeserta:React.FC<formInputProps> = ({kategori, posName}) => {
    

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [validateMsg, setValidateMsg] = useState()
    const [duplicateMsg, setDuplicatMsg] = useState()

    const [isError, setIsError] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [inputPeserta, setInputPeserta] = useState<InputPesertaComponent[]>([])

    const posId = posName.id
    const jumlahInput = 4
    


    const onSubmit = async(e: any) =>{
        setIsLoading(true)
        e.preventDefault()
        const formData = new FormData(e.target)
        const noPeserta = Object.fromEntries(formData)

        if (isGroupEmpty(noPeserta, setValidateMsg, setIsError)){
            setIsLoading(false)
            setIsEmpty(true)
            return toast.error("Ada kesalahan...!")
        }
        
        await axios
        // .post("/api/peserta", { noPeserta, kategori })
        .post("/api/peserta", { inputPeserta: transformData(inputPeserta), kategori, isPosFinish: posName.posFinish})
        .then(() => toast.success(AlertMessage.addSuccess))
        .catch(() => toast.error(AlertMessage.addFailed))
        .finally(() => {
            reset()
            setIsLoading(false)
        })

        console.log(transformData(inputPeserta))
        
    }

    const transformData = (data: TimeFormat[]): any[] =>{
        const result: any[] = [];

        // Iterate over each object in the inputData array
        data.forEach((inputObj) => {
            const id = inputObj.id;

            // Iterate over the properties of the current object
            for (const propName in inputObj) {
                if (propName !== 'id' && propName !== 'time') {
                    const newObj: any = { id };
                    newObj[propName] = inputObj[propName];

                    // Use type assertions to access properties of the 'time' object
                    const timeObj = inputObj['time'][0] as { hour: string; minute: string; second: string; millisecond: string };
                    newObj['time'] = timeObj.hour + ':' + timeObj.minute + ':' + timeObj.second + ':' + timeObj.millisecond;

                    result.push(newObj);
                }
            }
        })

        return result
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        
        const {value, name, id} = e.target
        const updateFieldData = inputPeserta.map((field) =>{
            if(field.id === id) {
                return {...field, [name]: value}
            }

            return field
        })
        
        setInputPeserta(updateFieldData)
    }

    const resetValidateMsg = () =>{
        if(isEmpty) {
            setValidateMsg(undefined)
            setIsEmpty(false)
        }
    }

    const reset = () =>{
        setInputPeserta([])
        initialPesertaInput()
    }

    function initialPesertaInput(){
        for(let i=0; i<jumlahInput; i++){
            const fieldName = `nopeserta${i+1}`
            const newInputComponent: InputPesertaComponent = {
                id: fieldName,
                [fieldName]: ""
            }
            
            newInputComponent.time = [
                {
                    hour: '',
                    minute: '',
                    second:'',
                    millisecond: '',
                },
            ]
             
            
            setInputPeserta((prevInputComponents) => [
                ...prevInputComponents, 
                newInputComponent
            ])
        }
    }
    const storeTimeValue = (name: string, value: string, inputId: string) => {
        setInputPeserta((prevInputPeserta) =>
            prevInputPeserta.map((item) =>
                item.id === inputId
                ? {
                    ...item,
                    time: [{ ...item.time[0], [name]: value }],
                }
                : item
            )
        )
        console.log(name)
        console.log(value)
    }

    const handleTimeChange = (e: any, inputId: string, pattern: any) =>{
        let { name, value } = e.target

        const regex = new RegExp(pattern)
        if(value === '' || value === null){
            storeTimeValue(name, value, inputId)
        // } else if (/^[0-9]?[0-9]|100$/.test(value)) {
        } else if (regex.test(value)) {
            storeTimeValue(name, value, inputId)
        }
    }

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>,inputId: string) =>{
        let { name, value } = e.target
        let numberValue = parseInt(value, 10)

        if(value === '' || value === null || value == '0'){
            value = '00'
        } else if(numberValue < 10 && numberValue > 0){
            value = `0${numberValue}`
        }

        storeTimeValue(name, value, inputId)
    }
    

    useEffect(() =>{
        setInputPeserta([])
        initialPesertaInput()
    },[])

    useEffect(() => {
        setIsError(validateMsg && Object.keys(validateMsg).length > 0 
        || duplicateMsg && Object.keys(duplicateMsg).length > 0
        ? true 
        : false)
    }, [validateMsg, duplicateMsg])

    
    return (
        <form onSubmit={onSubmit}>
            {JSON.stringify(inputPeserta)}
            {/* {JSON.stringify(validateMsg)} */}
            {/* {JSON.stringify(transformData(inputPeserta))} */}
            {/* {JSON.stringify(time)} */}
            <div className={`grid grid-cols-${jumlahInput} gap-5 mt-6 justify-center` }>
            {
                inputPeserta.map((pesertaField, i) => (
                    <div
                        key={i} 
                        className="
                            flex
                            flex-col
                            gap-2
                        "
                    >
                        <Input
                            id={pesertaField.id}
                            name={pesertaField.id}
                            label="No Peserta"
                            type='number'
                            value={pesertaField[pesertaField.id] }
                            disabled= {isLoading}
                            onChange={(e) => {
                                handleInputChange(e)
                                existValidate({e, model: "peserta", setValidateMsg, validateMsg, setIsError, isEdit:posId})
                                duplicateValidate(e, inputPeserta, setDuplicatMsg, duplicateMsg, setIsError)
                                resetValidateMsg()
                            }}
                            validateMsg={validateMsg}
                            isError = {isError}
                            secondValidateMsg={duplicateMsg}
                            isDoubleValidate
                        />
                        {
                            posName.posFinish && (
                            <div className="
                                flex
                                gap-1 
                                justify-center 
                                items-center
                            ">
                                    <TimeInput
                                        type="text"
                                        id={`hour${i}`}
                                        name="hour"
                                        value={pesertaField.time[0].hour}
                                        maxLength={2}
                                        placeholder="00"
                                        onBlur={(e) => handleBlur(e, pesertaField.id)}
                                        onChange={(e) => handleTimeChange(e, pesertaField.id, "^[0-9]?[0-9]|60$")}
                                        required
                                    />
                                    <span>:</span>
                                    <TimeInput
                                        type="text"
                                        id={`minute${i}`}
                                        name="minute"
                                        maxLength={2}
                                        placeholder="00"
                                        value={pesertaField.time[0].minute}
                                        onChange={(e) => handleTimeChange(e, pesertaField.id, "^[0-5]?[0-9]|60$")}
                                        onBlur={(e) => handleBlur(e, pesertaField.id)}
                                        required
                                    />
                                    <span>:</span>
                                    <TimeInput
                                        type="text"
                                        id={`second${i}`}
                                        name="second"
                                        maxLength={2}
                                        placeholder="00"
                                        value={pesertaField.time[0].second}
                                        onChange={(e) => handleTimeChange(e, pesertaField.id, "^[0-5]?[0-9]|60$")}
                                        onBlur={(e) => handleBlur(e, pesertaField.id)}
                                        required
                                    />
                                    <span>:</span>
                                    <TimeInput
                                        type="text"
                                        id={`millisecond${i}`}
                                        name="millisecond"
                                        maxLength={3}
                                        placeholder="000"
                                        value={pesertaField.time[0].millisecond}
                                        onChange={(e) => handleTimeChange(e, pesertaField.id, "^[0-9]{1,3}|100$")}
                                        onBlur={(e) => handleBlur(e, pesertaField.id)}
                                        required
                                    />

                            </div>
                        )}
                    </div>

                ))
                
            }
            </div>
            <div className="w-full flex justify-center">
                <Button 
                    type="submit"
                    text="Submit"
                    className="mt-6 px-10"
                    disabled ={isLoading || isError}
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
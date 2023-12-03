
import axios from "axios"
import { ValidateMessage } from "../types/validateMesssage"
import checkData from "../actions/checkData"
import { AlertMessage } from "../types/alertMessage"
import { type } from "os"

interface ValidateProps{
    event: any
    id?: string
    errorState: any
    dataState: any
    data: any[]
}

interface validationProps {
    e: React.ChangeEvent<HTMLInputElement>
    model?: string
    setValidateMsg?: any
    validateMsg?: any
    setIsError?: any
    isEdit?: string
}

interface ErrorMessages {
  [key: string]: string;
}

export const Validate = ({
    event, 
    id, 
    errorState, 
    dataState, 
    data
}: ValidateProps ) => {

    const { value, name } = event.target
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/

    function validateData (field: any) {
        field.error[name]= ""

        if (name === 'username'){
            const isValidUsername = usernameRegex.test(value)
            if(!isValidUsername) {
                field.error[name] = ValidateMessage.invalid
            }
        }

        if (value === null || value.trim() === "") {
            field.error[name] = ValidateMessage.required
        } 

        field[name] = value


        // Check for sameField error separately after updating namaPos
        const fieldValue = data.map((fieldItem: any) => fieldItem[name])

        const duplicateValues = fieldValue.filter((item: any, i: number) => 
            item && fieldValue.indexOf(item) !== i
        )

        data.forEach((fieldItem: any) => {
            if(value !== "" && !Object.values(field.error).includes(ValidateMessage.invalid)) {
                fieldItem.error[name] = ""
            }

            if (duplicateValues.includes(fieldItem[name])) {
                fieldItem.error[name] = ValidateMessage.sameField
            } 
        })


        return {...field, [name]: value}
    }

    const updateData = data.map((field) => {
        
        if (field.id === id) {
            validateData(field)
            // ditambah

        }

        return field
    })

    // cek error
    const hasError = updateData.every((item) => {
        const errorValues = Object.values(item.error);
        return errorValues.every((value) => value === "");
    })

    errorState(!hasError)

    dataState(updateData)
}

export async function Validasi (
    e: any, 
    types: any,  
    setValidateMsg: any,
    validateMsg: any,
    posId?: String
){

    const { value, name } = e.target
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/
    let data: any = {"data": value, "model": types}
    if(types === "peserta"){
        data = {"data": value, "model": types, "pos": posId}
    }

    let error: ErrorMessages  = {}

    // kosongkan keys value
    const fieldState = {...validateMsg}
    delete fieldState[name]
    setValidateMsg(fieldState)

    if (name && name === 'username'){
        const isValidUsername = usernameRegex.test(value)
        if(!isValidUsername) {
            error[name] = ValidateMessage.invalid
        }
    }

    if (name && name === 'password') passFormat(value, error, name)

    if (value === "") {
        error[name] = ValidateMessage.required
    }

    const respon = await axios.post("/api/check", data)
    if(respon.data.code == '409'){
        error[name] = ValidateMessage.exist
    }

    setValidateMsg((prev: any) => ({...prev, ...error}))

}

  export async function ValidasiPeserta (
    e: any, 
    types: any,  
    setValidateMsg: any,
    validateMsg: any,
    posId?: String
){
    const { value, name } = e.target
    if (value === null) return
    
    let data: any = {"data": value, "model": types}
    if(types === "peserta"){
        data = {"data": value, "model": types, "pos": posId}
    }
    const respon = await axios.post("/api/check", data)
    setValidateMsg((prevMsg: any) => {
        if (value === "") {
            return {
                ...prevMsg,
                [name]: [...(prevMsg[name] || []), ValidateMessage.required],
            }
        } else {
            return {
                ...prevMsg,
                [name]: (prevMsg[name] || []).filter((item: string) => item !== ValidateMessage.required),
            }
        }
    })

    setValidateMsg((prevMsg: any) => {
        if (respon.data.code === "409") {
            return {
                ...prevMsg,
                [name]: [...(prevMsg[name] || []), ValidateMessage.exist],
            }
        } else {
            if (prevMsg[name] && prevMsg[name].length === 1 && prevMsg[name].includes(ValidateMessage.exist)) {
                const { [name]: removedKey, ...rest } = prevMsg;
                return rest;
            }

            // if (validateMsg === null || Object.keys(validateMsg).length === 0){
            //     return
            // }
            
            return {
                ...prevMsg,
                [name]: prevMsg[name] && (prevMsg[name]).filter(
                    (item: string) => item !== ValidateMessage.exist
                ),
            }
        }
    })

}


// batas


export const usernameFormat = (value: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/
    const isValidUsername = usernameRegex.test(value)

    if(!isValidUsername) {
        return ValidateMessage.invalid
    }
    
}

const passFormat = (pass: string, error: any, name: string) => {

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);

    if (pass.length < minLength) {
        return error[name] = ValidateMessage.passMin
    }

    if (!hasUpperCase || !hasLowerCase) {
        return error[name] = ValidateMessage.passUpcase
    }

    if (!hasNumber) {
        return error[name] = ValidateMessage.passNumber
    }

    // If all rules pass, return an empty string for no error
    return
}


export async function isDuplicate(value: string, model: string) {
    const respon = await axios.post("/api/check", {
        data: value,
        model: model
    })

    if(respon.data.code == '409'){
       return ValidateMessage.exist
    }
}



export const usernameFormatValidate = ({ 
    e, 
    setValidateMsg, 
    validateMsg,
    setIsError
}: validationProps) => {

    const { value, id } = e.target
    let error: ErrorMessages  = {}
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/
    const isValidUsername = usernameRegex.test(value)

    
    const fieldState = {...validateMsg}
    delete fieldState[id]
    setValidateMsg(fieldState)
    setIsError(false)

    if(!isValidUsername) {
        error[id] = ValidateMessage.invalid
        setIsError(true)
    }
    setValidateMsg((prev: any) => ({...prev, ...error}))
}

export const requiredValidate = ({ 
    e, 
    setValidateMsg, 
    validateMsg,
    setIsError
}: validationProps) => {

    const { value, id } = e.target
    let error: ErrorMessages  = {}

    const fieldState = {...validateMsg}
    delete fieldState[id]
    setValidateMsg(fieldState)
    setIsError(false)

    if(value === ""  || value === null) {
        error[id] = ValidateMessage.required
        setIsError(true)
    }

    setValidateMsg((prev: any) => ({...prev, ...error}))
}

export const passValidate = ({ 
    e, 
    setValidateMsg, 
    validateMsg,
    setIsError
}: validationProps) => {

    const { value, id } = e.target
    let error: ErrorMessages  = {}

    const fieldState = {...validateMsg}
    delete fieldState[id]
    setValidateMsg(fieldState)
    setIsError(false)


    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    if (value.length < minLength) {
        error[id] = ValidateMessage.passMin
        setIsError(true)
        return setValidateMsg((prev: any) => ({...prev, ...error}))
    }

    if (!hasUpperCase || !hasLowerCase) {
        error[id] = ValidateMessage.passUpcase
        setIsError(true)
        return setValidateMsg((prev: any) => ({...prev, ...error}))
    }

    if (!hasNumber) {
        error[id] = ValidateMessage.passNumber
        setIsError(true)
        return setValidateMsg((prev: any) => ({...prev, ...error}))
    }

    
}
export const confirmPassValidate = ( 
    e: React.ChangeEvent<HTMLInputElement>,
    pass: string, 
    setValidateMsg: any, 
    validateMsg: any,
    setIsError: any
) => {

    const { value, id } = e.target
    let error: ErrorMessages  = {}

    const fieldState = {...validateMsg}
    delete fieldState[id]
    setValidateMsg(fieldState)
    setIsError(false)

    if (value !== pass) {
        error[id] = ValidateMessage.notSame
        setIsError(true)
    }
    
    console.log(`value : ${value}`)
    console.log(`pass : ${pass}`)

    setValidateMsg((prev: any) => ({...prev, ...error}))

    // If all rules pass, return an empty string for no erro
    
}

export const existValidate = async({ 
    e, 
    model, 
    setValidateMsg, 
    validateMsg,
    setIsError, 
    isEdit
}: validationProps) => {

    const { value, id } = e.target
    let error: ErrorMessages  = {}

    const fieldState = {...validateMsg}
    delete fieldState[id]
    setValidateMsg(fieldState)
    setIsError(false)

    const respon = await axios.post("/api/check", {
        data: value,
        model: model,
        isEdit
    })

    if(respon.data.code == '409'){
       error[id] = ValidateMessage.exist
       setIsError(true)
    }

    setValidateMsg((prev: any) => ({...prev, ...error}))
}

export const duplicateValidate = (
    e: React.ChangeEvent<HTMLInputElement>,
    data: any,
    setValidateMsg: any, 
    validateMsg: any,
    setIsError: any
) =>{
    const { value, id, name } = e.target

    if(value === "" || value === null) return

    let error: ErrorMessages  = {}
    const fieldState = {...validateMsg}
    delete fieldState[id]
    setValidateMsg(fieldState)
    setIsError(false)
    

    const updateData = data.map((field: any) =>{
        if(id === field.id){
            // masukan data ke state
            return {...field, [name]: value}        }

        return field 

    })

    // grouping data

    const posValues = updateData.map((field: any) => {
        if (name.includes("nopeserta")){
            return field[field.id]
        }

        return field[name]
    })

    const duplicateValues = posValues.filter((value: any, i: number, arr: any) =>
        value !== null && value !== "" && arr.indexOf(value) !== i
    );

    updateData.forEach((field: any) => {
        let fieldValue = ""
        if (name.includes("nopeserta")){
            fieldValue =  field[field.id]
        } else {
            fieldValue =  field[name]
        }

       

        if (duplicateValues.includes(fieldValue)) {
            error[field.id] = ValidateMessage.sameField
            setValidateMsg((prev: any) => ({...prev, ...error}))
            setIsError(true)
            
        } else {
            setValidateMsg((prev: any) => {
                const newState = { ...prev }
                delete newState[field.id]
                return newState
            })
            setIsError(false)
        }
        
    })


    // console.log(name)
    // console.log(updateData)
    // console.log(posValues)
    // console.log(duplicateValues)

}

export const isGroupEmpty = (
    data: any,
    setValidateMsg: any,
    setIsError: any
) =>{
    const  error: ErrorMessages  = {}
    let isEmpty = true
    for (const field in data){
        if(data[field] !== '' && data[field] !== null) {
            return isEmpty = false
        } else {
            error[field] = ValidateMessage.groupRequired
            
        }
    }

    if(isEmpty) {
        setValidateMsg(error)
        setIsError(true)
        return true
    } else {
        return false
    }

}
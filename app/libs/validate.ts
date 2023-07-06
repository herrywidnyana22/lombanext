
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


        return {... field, [name]: value}
    }

    const updateData = data.map((field) => {
        
        if (field.id === id) {
            validateData(field)
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

interface ErrorMessages {
  [key: string]: string;
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

    if (name && name === 'password') validatePassword(value, error, name)

    if (value === "") {
        error[name] = ValidateMessage.required
    }

    const respon = await axios.post("/api/check", data)
    if(respon.data.code == '409'){
        error[name] = ValidateMessage.exist
    }

    console.log(error)
    setValidateMsg((prev: any) => ({...prev, ...error}))

}

 const validatePassword = (pass: any, error: any, name: any) => {

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

  export async function VaidasiPeserta (
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

    if (value === "") {
        error[name] = ValidateMessage.required
    }

    const respon = await axios.post("/api/check", data)
    if(respon.data.code == '409'){
        error[name] = ValidateMessage.exist
    }

    console.log(error)
    setValidateMsg((prev: any) => ({...prev, ...error}))

}




'use client'
import clsx from "clsx"
import { ValidateCss } from "../../css/validate"

interface TimeInputProps{
    id?: any
    name?: any
    type?: string
    checked?: boolean
    value?: string | number
    pattern?: string
    maxLength?: number
    required?: boolean
    isError?: boolean
    placeholder?: string
    className?: string
    disabled?: boolean
    validateMsg?: any
    secondValidateMsg?: any
    readOnly?: boolean
    onChange?: (value:any) => void
    onBlur?: (value:any) => void
    isDoubleValidate?: boolean
}

const TimeInput:React.FC<TimeInputProps> = ({
    id,
    name,
    type,
    value,
    pattern,
    maxLength,
    disabled,
    placeholder,
    className,
    onChange,
    onBlur,
    validateMsg,
    secondValidateMsg,
    readOnly,
    isDoubleValidate,
    isError
}) => {
  return (
    <>
        <input
            id={id}
            name={name}
            type={type}
            pattern={pattern}            
            maxLength={maxLength}
            readOnly={readOnly}
            onBlur={onBlur}
            onChange = {onChange}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            className={clsx(`
                w-1/3
                border-0
                rounded-md
                text-gray-900
                ring-gray-300
                ring-inset
                p-2
                focus:ring-blue-400
                sm:leading-6
                sm:text-sm`,
                className,
                disabled && "opacity-80 cursor-not-allowed",
                readOnly 
                ? "ring-0 shadow-none"
                : "shadow-sm ring-1",
                isError && (validateMsg && validateMsg[id]
                ||  secondValidateMsg && secondValidateMsg[id])
                && ValidateCss.borderError
                
            )}
        />     

        
        <div className="flex flex-col">
            <span className="text-xs text-rose-400">
            {  validateMsg && Object.keys(validateMsg).length > 0 && validateMsg[id] }
            </span>
                
            <span className="text-xs text-rose-400">
            {secondValidateMsg && Object.keys(secondValidateMsg).length > 0 && secondValidateMsg[id] }
            
            </span>

        </div>
    </>
  )
}

export default TimeInput
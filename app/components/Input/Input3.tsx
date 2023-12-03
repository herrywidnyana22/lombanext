'use client'

import clsx from "clsx"
import { ValidateCss } from "../../css/validate"

interface InputProps{
    id?: any
    name?: any
    type?: string
    checked?: boolean
    value?: any
    label?: string
    required?: boolean
    isError?: boolean
    placeholder?: string
    className?: string
    disabled?: boolean
    validateMsg?: any
    secondValidateMsg?: any
    readOnly?: boolean
    onChange?: (value:any) => void
    onBlur?: () => void,
    isDoubleValidate?: boolean
}

export const Input:React.FC<InputProps> = ({
    id,
    name,
    type,
    value,
    label,
    disabled,
    placeholder,
    className,
    onChange,
    validateMsg,
    secondValidateMsg,
    onBlur,
    readOnly,
    isDoubleValidate,
    isError
}) => {
    return (
        <div className="relative flex flex-col">
        {
            label && 
            <label 
                htmlFor={id}
                className="
                    leading-6
                    font-medium
                    text-slate-600
                "
            >
                {label}
            </label>
        }
            <input
                id={id}
                name={name}
                type={type}
                onBlur={onBlur}
                readOnly={readOnly}
                onChange = {onChange}
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                className={clsx(`
                    block
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
            
        </div>
    )
}

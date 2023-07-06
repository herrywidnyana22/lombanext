'use client'

import { UseFormRegister, FieldErrors, FieldValues, FieldPathValue } from "react-hook-form"
import clsx from "clsx"

interface Input1Props{
    id: string
    register: any
    // register: UseFormRegister<FieldValues>
    value?: string | number
    label?: string
    type?: string
    required?: boolean
    error?: any
    // error?: FieldErrors
    disabled?: boolean
    onChange?: (value: any) => void
    placeholder?: string
    className?: string
    validateMessage?: string
    isError?: boolean
    fieldError?: any
}

const Input1:React.FC<Input1Props> = ({
    id,
    value,
    register,
    label,
    type,
    required,
    error,
    disabled,
    placeholder,
    className,
    onChange,
    isError,
    validateMessage,
    fieldError
}) => {

    console.log(fieldError)
    return (
    <div>
        <div className="flex items-center">
             <label htmlFor={id} className="
                leading-6
                font-medium
                text-sm
                text-slate-600
            ">
                {label}
                <input
                    id={id}
                    type={type}
                    {... register(id, {
                        required: "Wajib diisi.."
                    })}
                    onChange = {onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={id}
                    className={clsx(`
                        block
                        rounded-md
                        border-0
                        p-2
                        text-gray-900
                        shadow-sm
                        ring-1
                        ring-inset
                        ring-gray-300
                        sm:loading-6
                        sm:text-sm`,
                        className,
                        error && error[id] || isError ? "ring-rose-300 focus:ring-rose-500" : "focus:ring-blue-400",
                        disabled && "opacity-80 cursor-not-allowed"
                    )}
                />
            </label>
                
                
        </div>
        {   
        <div className="flex flex-col mt-1">
            {error && error[id] && (
                <span className="text-xs text-rose-400">
                    {error[id].message}
                </span>
            )}
            {fieldError === id && (
                <>
                <span className="text-xs text-rose-400">
                    {validateMessage}
                </span>
                </>
            )}
        </div>
        }
    </div>
    )
}

export default Input1


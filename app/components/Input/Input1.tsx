'use client'

import clsx from "clsx"
import { ValidateCss } from "../../css/validate"

interface InputProps{
    id?: string
    name?: any
    type?: string
    checked?: boolean
    value?: string | number
    label?: string
    required?: boolean
    isError?: boolean
    placeholder?: string
    className?: string
    disabled?: boolean
    validateMsg?: string
    readOnly?: boolean
    onChange?: (value:any) => void
    onBlur?: () => void
}

export const Input1:React.FC<InputProps> = ({
    id,
    name,
    type,
    value,
    label,
    required,
    disabled,
    placeholder,
    className,
    onChange,
    isError,
    validateMsg
}) => {

    return (
        <div>
            <div className="flex flex-col">
                
            {
                label && 
                <label 
                    htmlFor={id}
                    className="
                        leading-6
                        font-medium
                        text-sm
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
                    onChange = {onChange}
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    className={clsx(`
                        block
                        rounded-md
                        border-0
                        p-2
                        text-gray-900
                        shadow-sm
                        ring-1
                        ring-inset
                        focus:ring-blue-400
                        ring-gray-300
                        sm:loading-6
                        sm:text-sm`,
                        className,
                        isError && ValidateCss.borderError,
                        disabled && "opacity-80 cursor-not-allowed"
                    )}
                />     
                <span className="text-xs text-rose-400">{validateMsg}</span>
            </div>
        </div>
    )
}
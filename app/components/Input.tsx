'use client'

import clsx from "clsx"
import { ValidateCss } from "../css/validate"

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
    validateMsg?: any
    readOnly?: boolean
    onChange?: (value:any) => void
}

export const InputText:React.FC<InputProps> = ({
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
    validateMsg
}) => {

    return (
        <div>
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
                        validateMsg && validateMsg[name] && ValidateCss.borderError,
                        disabled && "opacity-80 cursor-not-allowed"
                    )}
                />     
                {validateMsg && name && (
                    <div className="absolute -bottom-5">
                        <span className="text-xs text-rose-400">{validateMsg[name]}</span>
                    </div>
                )}  
            </div>
        </div>
    )
}

export const InputTable:React.FC<InputProps> = ({
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
    validateMsg,
    readOnly
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
                    className={clsx(
                        className,
                        isError && ValidateCss.borderError,
                        disabled && "opacity-80 cursor-not-allowed"
                    )}
                    readOnly={readOnly}
                />
                {validateMsg && name && (
                    <span className="text-xs text-rose-400">{validateMsg[name]}</span>
                )}    
            </div>
        </div>
    )
}


export const OptionInput: React.FC<InputProps> = ({
    id,
    name,
    type,
    checked,
    value,
    label,
    required,
    disabled,
    placeholder,
    className,
    onChange,
    isError,
}) => {
  return (
    <div className="
        flex 
        gap-2
        items-center
    ">
        <input 
            type={type}
            checked={checked}
            value={value}
            className={clsx(`
                w-4 
                h-4`,
                className,
            )}
            name={name}
            onChange={onChange}
            disabled={disabled}
        />
        <label>
            {label}
        </label>
    </div>
  )
}



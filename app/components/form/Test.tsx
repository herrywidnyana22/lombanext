
'use client'

import clsx from "clsx";
import { useState } from "react";
import {format} from "@/app/libs/Formater";


const Test = () => {
    const jumlahInput = 4;
    const [inputValues, setInputValues] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("")

    const cekduplicate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // setInputValues((prevValues) => {
        //     const duplicatesExist = prevValues.includes(value);
        //     if (duplicatesExist) {
        //     return prevValues.map((prevValue) => (prevValue === value ? "ganda" : prevValue));
        //     } else {
        //     return prevValues;
        //     }
        // });
        const dataFormat = format(value)

        setInputValue(dataFormat)
    }

    return (
        <div>
            <label className="
                leading-6
                font-medium
                text-sm
                text-slate-600
            ">
                {inputValue}
            </label>
            {Array.from({ length: jumlahInput }, (_, i) => (
            <input
                key={i}
                type="text"
                onChange={cekduplicate}
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
                    inputValues[i] === "ganda" 
                    ? "ring-rose-300 focus:ring-rose-500" 
                    : "focus:ring-blue-400"
                )}
            />
            ))}
        </div>
    )
}

export default Test
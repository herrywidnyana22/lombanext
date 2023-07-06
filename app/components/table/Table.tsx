'use client'


import { BsPencil, BsTrash, BsCheck2, BsX, BsDash } from "react-icons/bs"


import Button from "../Button"
import format from "@/app/libs/Formater"
import { TableHTMLAttributes, useState } from "react"
import { TableProps } from "@/app/types/tableTypes"




const Table: React.FC<TableProps> = ({data}) => {

    const fieldNames: any = []
    data.length > 0 &&
    Object.keys(data[0]).map((fieldName, i) => (
        fieldNames.push(fieldName)      
    ))

    return (
    <>
        {
            data.length > 0 &&
            <table 
                className="
                    w-full
                    table-auto 
                    mt-6
                    border 
                    border-zinc-100 
                    text-slate-600"
                >
                <thead>
                    <tr className="
                        border-b 
                        border-zinc-100 
                        bg-zinc-100
                    ">
                        <th className="py-4 text-center">
                                <input type="checkbox" className="w-4 h-4 checked:bg-blue-400" />
                        </th>

                        <th className="py-4">#</th>
                    {
                        // dinamic field form Model
                        fieldNames.map((item: string, i: number) => (
                            fieldNames[i] !== 'id' &&
                            <th key={i} className="py-4">{format(item)}</th>
                        ))

                    }  
                        <th className="py-4 w-10"></th>
                    </tr>
                </thead>
                <tbody>
                {
                    data.map((dataObj, index, ) => (
                    <tr key={index} className="border-b border-zinc-100">
                        <td className="text-center">
                            <input value={dataObj.id} type="checkbox" className="w-4 h-4 checked:bg-blue-400" />
                        </td>
                        <td className="text-center py-3">{index+1}</td>
                        {
                            fieldNames.map((kolom: any, i:number) => (
                            
                                dataObj[kolom] instanceof Date 
                                ?  <td key={i} className="text-left py-3">{dataObj[kolom].toLocaleString()}</td> 
                                :  fieldNames[i] !== 'id' && <td key={i} className="text-left py-3">{dataObj[kolom]}</td> 
                            ))
                        }
                        <td className="text-center p-3">
                            <div className="flex gap-2 items-center justify-center ">
                                <span className="
                                    p-2 
                                    rounded-md 
                                    hover:bg-orange-300 
                                    hover:text-white 
                                    cursor-pointer
                                    transition
                                ">
                                        <BsPencil/>
                                </span>
                                <span className="p-2 
                                    rounded-md 
                                    hover:bg-rose-500 
                                    hover:text-white 
                                    cursor-pointer
                                    transition
                                ">
                                    <BsTrash/>
                                </span>
                            </div>
                        </td>
                    </tr>
                        
                    ))
                }
                    
                </tbody>
            </table>
        }

    
    </>
            
    )
}

export default Table
        // <table 
        //     className="
        //         w-full
        //         table-auto 
        //         mt-6
        //         border 
        //         border-zinc-100 
        //         text-slate-600"
        //     >
        //     <thead>
        //         <tr className="
        //             border-b 
        //             border-zinc-100 
        //             bg-zinc-100
        //         ">
        //             <th className="py-4 text-center">
        //                     <input type="checkbox" className="w-4 h-4 checked:bg-blue-400" />
        //             </th>

        //             <th className="py-4">#</th>
        //         {
        //             // dinamic field form Model
        //             data.length > 0 &&
        //             fieldNames.map((item: string, index: number) => (
        //             <>
        //                 <th key={i} className="py-4">{format(item)}</th>
        //             </>
        //             ))

        //         }  
        //             <th className="py-4 w-10"></th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //     {
        //         data.length > 0 &&
        //             data.map((dataObj, dataIndex) => (
        //             <tr key={dataIndex} className="border-b border-zinc-100">
        //             {
        //                 fieldNames.map((kolom: any, i:number) => (
        //                 <>
        //                     <td className="text-center">
        //                         <input value={dataObj[kolom]} type="checkbox" className="w-4 h-4 checked:bg-blue-400" />
        //                     </td>
        //                     <td className="text-center py-3">{i+1}</td>
        //                     <td className="text-center py-3">{dataObj[kolom] instanceof Date ? dataObj[kolom].toLocaleString() : data[kolom]}</td>
        //                     <td className="text-center py-3">
        //                         <span className="flex items-center justify-center">
        //                             <BsCheck2/>
        //                         </span>
        //                     </td>
        //                     <td className="text-center py-3">
        //                         <span className="flex items-center justify-center">
        //                             <BsCheck2/>
        //                         </span>
        //                     </td>
        //                     <td className="text-center py-3">
        //                         <span className="flex items-center justify-center">
        //                             <BsCheck2/>
        //                         </span>
        //                     </td>
        //                     <td className="text-center py-3">
        //                         <span className="flex items-center justify-center">
        //                             <BsCheck2/>
        //                         </span>
        //                     </td>
                            
        //                     <td className="text-center py-3">
        //                         <span className="flex items-center justify-center">
        //                             {"01:12:34"}
        //                         </span>
        //                     </td>
        //                     <td className="text-center w-10 p-3">
        //                         <div className="flex gap-2 items-center justify-center ">
        //                             <span className="
        //                                 p-2 
        //                                 rounded-md 
        //                                 hover:bg-orange-300 
        //                                 hover:text-white 
        //                                 cursor-pointer
        //                                 transition
        //                             ">
        //                                     <BsPencil/>
        //                             </span>
        //                             <span className="p-2 
        //                                 rounded-md 
        //                                 hover:bg-rose-500 
        //                                 hover:text-white 
        //                                 cursor-pointer
        //                                 transition
        //                             ">
        //                                 <BsTrash/>
        //                             </span>
        //                         </div>
        //                     </td>
                        
        //                 </>
                    
        //             ))}
        //             </tr>
                    
        //         ))
        //     }
                
        //     </tbody>
        // </table>
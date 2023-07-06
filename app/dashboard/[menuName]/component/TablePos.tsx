'use client'

import Button from '@/app/components/Button'
import { TableProps } from '@/app/types/tableTypes'
import { useState } from 'react'
import { BsPencil, BsTrash, BsCheck2, BsX } from 'react-icons/bs'


const TablePos:React.FC<TableProps> = ({data}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    return (    
            
    <>
    {
        data.length > 0 && 
        <>
        <table
            className="
                w-full
                table-auto 
                mt-6
                border 
                border-zinc-100 
                text-slate-600
            "  
        >
            <thead>
                <tr className="
                    border-b 
                    border-zinc-100 
                    bg-zinc-100
                ">
                    <th className="py-1 text-center w-10">
                        <input type="checkbox" className="w-4 h-4 checked:bg-blue-400" />
                    </th>
                    <th className="py-1 w-10">#</th>
                    <th className="py-4 text-center">Nama Pos</th>
                    <th className="py-4 text-center">Pos Finish</th>
                    <th className="py-4 text-center">Panitia</th>
                    <th className="py-4 w-10"></th>
                </tr>
            </thead>
            <tbody>
            {
                data.map((item, i) => (
                    <tr key={i} className="border-b border-zinc-100">
                        <td className="py-1 w-10 text-center">
                            <input value={item.id} type="checkbox" className="w-4 h-4 checked:bg-blue-400" />
                        </td>
                        <td className="text-center py-1 w-10 border-r border-zinc-100">{i+1}</td>
                        <td className="text-left p-3">{item.namaPos}</td> 
                        <td className="flex justify-center p-3">{item.posFinish ? <BsCheck2/> : <BsX/>}</td> 
                        <td className="text-left p-3">{item.panitia}</td>  
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
        <Button 
            type='button'
            icon={BsTrash}
            disabled={isLoading}
            danger
            onClick={() => {}}
        />
        
        </>
    }
        
    </>
        
      
    )
}

export default TablePos
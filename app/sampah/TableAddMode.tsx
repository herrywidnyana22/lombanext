'use client'

import Button from '@/app/components/Button'
import axios from 'axios'
import clsx from 'clsx'
import { TableProps } from '@/app/types/tableTypes'
import { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsPencil, BsSaveFill, BsTrash, BsCheck2, BsPlusLg, BsX } from 'react-icons/bs'
import { useRouter } from "next/navigation"
import { Loading } from '@/app/components/Loading'

const TableEditable:React.FC<TableProps> = ({data}) => {
    const [addMode, setAddMode] = useState<boolean>(false)
    const [editMode, setEditMode] = useState<number | null>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedDelete, setSelectedDelete] = useState<number | null>()
    const router = useRouter()

    const lastIndex = data.length + 1
    const onEditClick = (i:number) =>{
        editMode === i
        ? setEditMode(null)
        : setEditMode(i)
    }

    const onDelete = useCallback((id: string, i: number) => {
        setIsLoading(true)
        setSelectedDelete(i)
        const kategoriId: string = id

        axios.delete(`/api/kategori/${kategoriId}`)
        .then (() => {
            toast.success("Data berhasil dihapus") 
            router.refresh()
        })
        .catch (() =>{
            toast.error("Data gagal dihapus")
        })
        .finally(() => {
            setIsLoading(false)
            setSelectedDelete(null)
        })
    
    },[router])

    const onAdd = async() =>{
        setIsLoading(true)

        await axios.delete(`/api/kategori`)
        .then (() => {
            toast.success("Data berhasil dihapus") 
            router.refresh()
        })
        .catch (() =>{
            toast.error("Data gagal dihapus")
        })
        .finally(() => {
            setIsLoading(false)
            setSelectedDelete(null)
        })
    }

    return (    
    <>
    {
        data.length > 0 && 
        <>
        <p>{isLoading ? "true" : "false"}</p>
        <table
            className="
                w-full
                table-auto 
                mt-6
                border 
                border-zinc-200 
                text-slate-600
                
            "  
        >
            <thead>
                <tr className="
                    border-b 
                    border-zinc-200 
                    bg-zinc-100
                ">
                    <th className="py-1 w-10 text-center">
                        <input type="checkbox" className="w-4 h-4 checked:bg-blue-400" />
                    </th>
                    <th className="py-1 w-10">#</th>
                    <th className="py-4 text-center">Nama Kategori</th>
                    <th className="py-4 text-center">Nama Panitia</th>
                    <th className="py-4 text-center">Jumlah Pos</th>
                    <th className="py-4 text-center">Pos</th>
                    <th className="py-4 w-10"></th>
                </tr>
            </thead>
            <tbody>
            {
                data.map((item, i) => (
                    <tr key={i} className="border-b border-zinc-200">
                        <td className="py-1 w-10 text-center">
                            <input value={item.id} type="checkbox" className="w-4 h-4 checked:bg-blue-400" />
                        </td>
                        <td className="text-center border-r border-zinc-100">{i+1}</td>
                        <td className="text-left p-3">
                            <input 
                                className={clsx(
                                    editMode === i && `
                                    w-full
                                    border  
                                    border-zinc-200 
                                    rounded-md 
                                    py-1 px-4
                                    focus:border-orange-300`
                                )} 
                                type="text" 
                                value={item.namaKategori}
                                readOnly={editMode !== i}
                            />
                        </td> 
                        <td className="text-left p-3">
                            <input 
                                className={clsx(
                                    editMode === i && `
                                    w-full
                                    border  
                                    border-zinc-200 
                                    rounded-md 
                                    py-1 px-4
                                    focus:border-orange-300`
                                )} 
                                type="text" 
                                value={item.panitia}
                                readOnly={editMode !== i}
                            />
                        </td> 
                        <td className="text-left p-3">
                            <input 
                                className={clsx(
                                    editMode === i && `
                                    w-full
                                    border  
                                    border-zinc-200 
                                    rounded-md 
                                    py-1 px-4
                                    focus:border-orange-300`
                                )} 
                                type="text" 
                                value={item.pos.length}
                                readOnly={editMode !== i}
                            />
                        </td> 
                        <td className="text-left p-3">
                            <input 
                                className={clsx(
                                    editMode === i && `
                                    w-full
                                    border  
                                    border-zinc-200 
                                    rounded-md 
                                    py-1 px-4
                                    focus:border-orange-300`
                                )} 
                                type="text" 
                                value={item.pos}
                                readOnly={editMode !== i}
                            />
                        </td> 
                        <td className="text-center p-3">
                            <div className="flex gap-2 items-center justify-center ">
                                <span 
                                    className={clsx(`
                                        p-2 
                                        rounded-md 
                                        hover:text-white 
                                        cursor-pointer
                                        transition`,
                                        editMode === i 
                                        ? "hover:bg-green-300"
                                        : "hover:bg-orange-200 "
                                    )}
                                    onClick={() =>onEditClick(i)}
                                >
                                    {editMode === i ? <BsCheck2/> : <BsPencil/>}
                                </span>
                                <span 
                                    className="p-2 
                                        rounded-md 
                                        hover:bg-rose-500 
                                        hover:text-white 
                                        cursor-pointer
                                        transition
                                    "
                                    onClick={() => onDelete(item.id, i)}
                                >
                                    {(isLoading && selectedDelete === i) ? <Loading/> : <BsTrash/>}
                                </span>
                            </div>
                        </td>
                    </tr>
                ))
            }
            {
                addMode &&
                <tr className="border-b border-zinc-200">
                    <td 
                        colSpan={2} 
                        className="
                            text-center 
                            border-r 
                            border-zinc-100
                            cursor-pointer
                            hover:bg-zinc-200
                            h-2
                        "
                    >
                        {"New"}
                    </td>
                    <td className="text-left p-3">
                        <input 
                            className={clsx(`
                                w-full
                                border  
                                border-zinc-200 
                                rounded-md 
                                py-1 px-4
                                focus:border-orange-300`
                            )} 
                            type="text"
                        />
                    </td> 
                    <td className="text-left p-3">
                        <input 
                            className={clsx(`
                                w-full
                                border  
                                border-zinc-200 
                                rounded-md 
                                py-1 px-4
                                focus:border-orange-300`
                            )} 
                            type="text" 
                        />
                    </td> 
                    <td className="text-left p-3">
                        <input 
                            className={clsx(`
                                w-full
                                border  
                                border-zinc-200 
                                rounded-md 
                                py-1 px-4
                                focus:border-orange-300`
                            )} 
                            type="text" 
                        />
                    </td> 
                    <td className='
                        flex 
                        justify-center 
                        items-center 
                        px-2'
                    >
                        <Button 
                            type='button'
                            text={"Save"}
                            icon={isLoading ? Loading : BsSaveFill }
                            disabled={isLoading}
                            onClick={onAdd}
                        />
                    </td>
                    
                </tr>
            }
            
            </tbody>
        </table>
        
        
        <div className="
            flex 
            gap-2 
            items-center 
            justify-between
            mb-3 
        ">
            <Button 
                type='button'
                icon={BsTrash}
                disabled={isLoading}
                danger
                onClick={() => {}}
            />
            <Button 
                type='button'
                icon={addMode ? BsX : BsPlusLg }
                disabled= {isLoading}
                onClick={() => setAddMode(!addMode)}
            />
        </div>
        
        </>
    }
        
    </>
        
      
    )
}

export default TableEditable
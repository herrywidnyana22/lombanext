'use client'

import { Loading } from '@/app/components/Loading'
import { BsCheck2, BsPencil, BsTrash, BsX } from 'react-icons/bs'
import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { ValidateCss } from '@/app/css/validate'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { AlertMessage } from '@/app/types/alertMessage'
import axios from 'axios'
import { dataFormat } from '@/app/libs/Formater'
import Button from '@/app/components/Button'
import { ShowModal } from '@/app/components/modal/Modal'

interface TablePesertaProps{
  data?: any[]
  pos?: any
  posId?: any
}

const TablePeserta:React.FC<TablePesertaProps> = ({data, pos, posId}) => {
    const [pesertaData, setPesertaData] = useState(data)
    const [posName, setPosName] = useState(pos)

    const [editMode, setEditMode] = useState<number | null>(null)

    // check state
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isCheckAll, setIsCheckAll] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    
     // delete state
    const [checkAll, setCheckAll] = useState<string[]>([])
    const [selectedDelete, setSelectedDelete] = useState<number | null>()
    const [deletedPos, setDeletedPos] = useState<any[]>([])

    const router = useRouter()
    
    // Delete prosedure
    const oncheckAll = useCallback(() =>{
        setIsCheckAll(!isCheckAll)
        setCheckAll(isCheckAll ? [] : data ? data.map((item) => item.id) : [])
        
    },[data, isCheckAll])
    
   
    const onSingleCheck = (e: any, itemId: string) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setCheckAll((prevItems) => [...prevItems, itemId]);
        } else {
            setCheckAll((prevItems) => prevItems.filter((id) => id !== itemId));
        }
    }
    
    // use patch because bring more than 1 iD
    const onDeleteAll = async() =>{
        setIsLoading(true)

        await axios.patch(`/api/peserta`, {data: checkAll})
        .then (() => {
            toast.success(AlertMessage.removeSuccess) 
            router.refresh()
        })
        .catch (() =>{
            toast.error(AlertMessage.removeFailed)
        })
        .finally(() => {
            setIsLoading(false)
            setSelectedDelete(null)
            setCheckAll([])
        })
    }

    const onDelete =async(id: string, i: number) => {
        setIsLoading(true)
        setSelectedDelete(i)
        const pesertaId = id

        await axios.delete(`/api/peserta/${pesertaId}`)
        .then (() => {
            toast.success(AlertMessage.removeSuccess) 
            router.refresh()
        })
        .catch (() =>{
            toast.error(AlertMessage.removeFailed)
        })
        .finally(() => {
            setIsLoading(false)
            setSelectedDelete(null)
            setEditMode(null)
        })
    
    }

    useEffect(() =>{
       dataFormat(data, setPesertaData)
    },[data])
    
    return (
    <>
        <div className='flex flex-col gap-2 debugging'>
            <div>{JSON.stringify(pesertaData)}</div>
            <div>{JSON.stringify(posId)}</div>
        </div>
        {
            pesertaData && pesertaData.length > 0 && (
            <>
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
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 checked:bg-blue-400"
                                checked={data?.length === checkAll.length} 
                                onChange={oncheckAll}
                            />
                        </th>
                        <th className="py-1 w-10">#</th>
                        <th className="py-4 text-center">No Peserta</th>
                        {
                            posName.map((pos: any, i: number) =>(
                                <th key={i} className="py-4 text-center w-20">{pos.namaPos}</th>
                            ))
                        }
                        <th className="py-4 text-center">Waktu</th>
                        <th className="py-4 w-10"></th>
                    </tr>
                </thead>
                <tbody>
                {
                    pesertaData && pesertaData.map((peserta, pesertaIndex) =>(
                        <tr 
                            key={pesertaIndex}
                            className={clsx(`
                                border-b 
                                border-zinc-200`,
                                editMode !== null && editMode !== pesertaIndex && "opacity-60 pointer-events-none"
                            )}
                        >
                            <td className="py-1 w-10 text-center">
                            {
                                peserta.pos.some((item: any) => item.id === posId.id) && (
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 checked:bg-blue-400"
                                        checked={checkAll.includes(peserta.id)}
                                        onChange={(e) => onSingleCheck(e, peserta.id)} 
                                    />
                                )
                            }
                            </td>
                            <td className="text-center border-r border-zinc-100">{pesertaIndex+1}</td>
                            <td className="text-left py-3 px-6">{peserta.noPeserta}</td>
                            {
                            posName.map((pos: any, i: number) =>(
                                    <td 
                                        key={i} 
                                        className="py-1 w-10 text-center"
                                    >
                                        <span className='flex justify-center'>
                                        {
                                            peserta.pos.find((data: any) => data.namaPos === pos.namaPos) 
                                            ? <BsCheck2/>
                                            : null
                                        }
                                        </span>
                                    </td>
                                ))
                            }
                            <td className='text-center'>{peserta.waktu}</td>
                            <td className="text-center p-3">
                            {
                                peserta.pos.some((item: any) => item.id === posId.id) && (
                                <div className="flex 
                                    gap-2 
                                    items-center 
                                    justify-center 
                                ">
                                    <div className={clsx(`
                                        flex 
                                        gap-1 
                                        p-1 
                                        transition duration-200`,
                                        editMode === pesertaIndex && 
                                        `border
                                        border-zinc-300
                                        rounded-md`    
                                    )}>
                                        <span 
                                            className={clsx(`
                                                p-2 
                                                rounded-md 
                                                hover:text-white 
                                                cursor-pointer
                                                transition`,
                                                editMode === pesertaIndex
                                                ? "hover:bg-green-300"
                                                : "hover:bg-orange-200 ",
                                                editMode === pesertaIndex && isError && ValidateCss.buttonDisabled
                                            )}
                                            // onClick={() =>onEdit(i, kategori.id)}
                                        >
                                        {   
                                            editMode === pesertaIndex 
                                            ? isLoading ? <Loading/> : <BsCheck2/> 
                                            : <BsPencil/>
                                        }
                                        </span>
                                        {
                                            editMode === pesertaIndex &&
                                            <span 
                                                className={clsx(`
                                                    p-2 
                                                    rounded-md 
                                                    hover:text-white 
                                                    cursor-pointer
                                                    transition
                                                    hover:bg-orange-200`
                                                )}
                                                // onClick={onCancel}
                                            >
                                                {<BsX/>}
                                            </span>
                                        }
                                    </div>
                                    
                                    <span 
                                        className="p-2 
                                            rounded-md 
                                            hover:bg-rose-500 
                                            hover:text-white 
                                            cursor-pointer
                                            transition
                                        "
                                        onClick={() => onDelete(peserta.id, pesertaIndex)}
                                    >
                                        {(isLoading && selectedDelete === pesertaIndex) 
                                        ? <Loading/> 
                                        : <BsTrash/>}
                                    </span>
                                </div>
                                )
                            }
                            </td>
                        </tr>

                    ))

                }
                </tbody>
            </table>
            <div className={clsx(`
                flex
                gap-2 
                items-center 
                justify-end
                mb-3`,
                checkAll.length > 0 && "justify-between"
            )}>
                    
            {
                checkAll.length > 0 &&
                <Button 
                    type='button'
                    icon={isLoading ? Loading : BsTrash}
                    disabled={isLoading}
                    danger
                    onClick={onDeleteAll}
                    text={`Hapus ${checkAll.length}`}
                />
            }
            </div>
            </>
            
        )}
    </>
    )
}

export default TablePeserta
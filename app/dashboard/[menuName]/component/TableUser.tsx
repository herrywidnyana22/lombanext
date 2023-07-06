'use client'

import { Loading } from '@/app/components/Loading'
import { TableProps } from '@/app/types/tableTypes'
import { BsCheck2, BsPencil, BsPlusLg, BsTrash, BsX } from 'react-icons/bs'
import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { AlertMessage } from '@/app/types/alertMessage'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ValidateCss } from '@/app/css/validate'
import { ShowModal } from '@/app/components/modal/Modal'
import FormAddPanitia from '@/app/components/form/FormAddPanitia'
import Button from '@/app/components/Button'
import { InputTable, InputText, OptionInput } from '@/app/components/Input'
import { ValidateMessage } from '@/app/types/validateMesssage'
import { Validate } from '@/app/libs/validate'
import { dataFormat } from '@/app/libs/Formater'

const TableUser:React.FC<TableProps> = ({data}) => {
    const [panitiaData, setPanitiaData] = useState(data)
    const [panitaSelected, setPanitiaSelected] = useState<any[]>([])
    const [editMode, setEditMode] = useState<number | null>(null)

     // delete state
    const [checkAll, setCheckAll] = useState<string[]>([])
    const [selectedDelete, setSelectedDelete] = useState<number | null>()
    const [deletedPos, setDeletedPos] = useState<any[]>([])

        // check state
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isCheckAll, setIsCheckAll] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)

    // edit pos state
    const [selectedPos, setSelectedPos] = useState<any[]>([])


    const router = useRouter()

    const onCancel = () =>{
        dataFormat(data, setPanitiaData)
        setEditMode(null)
        setDeletedPos([])
        setIsLoading(false)
        setIsError(false)
        setSelectedPos([])
    }

    // edit prosedure
    const onSelectedPos = (kategoriId: string, posId: string, namaPos?: string, namaKategori?: string) =>{
        selectedPos !== null && onRemovePos(kategoriId)
        
        const newObject = {[kategoriId]: posId}
        
        const duplicateObject = selectedPos.find(obj => obj[kategoriId] === posId)
        if(duplicateObject) return

        setSelectedPos(prev => [...prev, newObject])

        const updatePanitiaData = panitiaData.map((panitia: any) =>{
            if(panitia.pos.find((pos: any) => pos.kategori.id === kategoriId)){
                panitia.pos = panitia.pos.map((pos: any) =>{
                    if(pos.kategori.id === kategoriId){
                        return {
                            ... pos, 
                            id: posId,
                            namaPos: namaPos
                        }
                    } 
                    return pos

                })
            } else {
                panitia.pos.push({
                    id: posId,
                    namaPos: namaPos,
                    kategori:{
                        id: kategoriId,
                        namaKategori
                    }
                })
            }
            return panitia
        })

        return updatePanitiaData
    }
    
    const onRemovePos = (kategoriId: string) => {
        setSelectedPos(prev => prev.filter(obj => Object.keys(obj)[0] !== kategoriId))
    }

    const removePosData =(kategoriId: string) => {
        // remove pos
        const updatePanitiaData = panitiaData.map((panitia: any) =>{
            if(panitia.pos.find((pos: any) => pos.kategori.id === kategoriId)){
                panitia.pos = panitia.pos.filter((pos: any) => pos.kategori.id !== kategoriId)
            }
            return panitia
        })

        return updatePanitiaData
    }


    // Delete prosedure
    const oncheckAll = useCallback(() =>{
        setIsCheckAll(!isCheckAll)
        setCheckAll(isCheckAll ? [] : data.map((item) => item.id))
        
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

        await axios.patch(`/api/panitia`, {data: checkAll})
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
        const panitiaId = id

        await axios.delete(`/api/panitia/${panitiaId}`)
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
            setSelectedPos([])
        })
    
    }

    const onEdit = async(panitiaId: string, panitiaIndex: number) =>{
        const respon = await axios.get("/api/kategori")
        const pos = respon.data
        setPanitiaSelected(pos)

        const panitia = data[panitiaIndex]
        const newSelectedPos = [...selectedPos]

        panitia.pos.forEach((pos: any) => {
            const existingEntryIndex = newSelectedPos.findIndex(
                (entry) => entry[pos.kategori.id] === pos.id
            )

            if (existingEntryIndex !== -1) {
                newSelectedPos.splice(existingEntryIndex, 1)
            } else {
                const newEntry = {
                    [pos.kategori.id]: pos.id,
                }
                newSelectedPos.push(newEntry)
            }
        })

        setSelectedPos(newSelectedPos)


        if(editMode === panitiaIndex){
            setIsLoading(true)
            const data = panitiaData.filter((selected) => selected.id === panitiaId)
            await axios.patch(`/api/panitia/${panitiaId}`, data)
            .then (() => {
                toast.success(AlertMessage.editSuccess) 
                router.refresh()
            })
            .catch (() =>{
                toast.error(AlertMessage.editFailed)
            })
            .finally(() => {
                setIsLoading(false)
                setSelectedDelete(null)
                setEditMode(null)
                setSelectedPos([])

            })
        } else {
            setEditMode(panitiaIndex)
        }
    }

    useEffect(() => {
        dataFormat(data, setPanitiaData)
    }, [data])
    
    console.log(panitiaData)
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
                                    checked={data.length === checkAll.length} 
                                    onChange={oncheckAll}
                                />
                            </th>
                            <th className="py-4 text-center w-[25%]">Nama</th>
                            <th className="py-4 text-center w-[15%]">Username</th>
                            <th className="py-4 text-center w-[30%]">Kategori</th>
                            <th className="py-4 text-center ">Pos</th>
                            <th className="py-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        panitiaData.map((panitia, panitiaIndex) =>(
                            <tr 
                                key={panitiaIndex} 
                                className={clsx(`
                                    border-b 
                                    border-zinc-200`,
                                    editMode !== null && editMode !== panitiaIndex && 
                                    "opacity-60 pointer-events-none"
                                )}
                            >
                                <td className="py-1 text-center w-10">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 checked:bg-blue-400"
                                        checked={checkAll.includes(panitia.id)}
                                        onChange={(e) => onSingleCheck(e, panitia.id)} 
                                    />
                                </td>
                                <td className='p-3'>
                                    <InputTable 
                                        type='text'
                                        name='namaPanitia'
                                        value={panitia.namaPanitia}
                                        disabled={isLoading}
                                        readOnly={editMode !== panitiaIndex}
                                        className={clsx(
                                            editMode === panitiaIndex && `
                                            border 
                                            rounded-md 
                                            py-1 px-4
                                            focus:border-orange-300`,
                                            isError && panitia.error['namaPanitia'] !== ""
                                            ? ValidateCss.borderError
                                            : "border-zinc-200" 
                                        )}
                                        onChange={(e) => Validate({ event: e, id: panitia.id, errorState: setIsError, dataState: setPanitiaData, data: panitiaData })}
                                        validateMsg={panitia.error}
                                        
                                    />
                                </td>
                                <td className='p-3'>
                                    <InputTable 
                                        type='text'
                                        name='username'
                                        value={panitia.username}
                                        disabled={isLoading}
                                        readOnly={editMode !== panitiaIndex}
                                        className={clsx(
                                            editMode === panitiaIndex && `
                                            border 
                                            rounded-md 
                                            py-1 px-4
                                            focus:border-orange-300`,
                                            isError && panitia.error['username'] !== ""
                                            ? ValidateCss.borderError
                                            : "border-zinc-200"
                                        )}
                                        onChange={(e) => Validate({ event: e, id: panitia.id, errorState: setIsError, dataState: setPanitiaData, data: panitiaData })}
                                        validateMsg={panitia.error}
                                        // isError ={isError && editMode === panitiaIndex}
                                    />
                                </td>
                                <td className='p-3'>
                                {  
                                    editMode !== panitiaIndex && (
                                        panitia.pos.some((pos: any) => pos.panitia !== null)
                                        ? (
                                            panitia.pos
                                            .filter((pos: any) => pos.kategori !== null)
                                            .map((pos: any) => pos.kategori.namaKategori)
                                            .join(", ")
                                          )  
                                        : "Belum ada pos"
                                    )
                                }
                                
                                {   
                                
                                    editMode === panitiaIndex &&
                                    (
                                    <div className='grid grid-cols-2 gap-2 place-items-start'>
                                    {
                                        panitaSelected.map((kategori, i) =>(
                                        <div key={i} className="flex flex-col">
                                            <OptionInput
                                                checked={
                                                    selectedPos.some((obj) => 
                                                        Object.keys(obj).includes(kategori.id)
                                                    )
                                                } 
                                                id="namaKategori"
                                                type="checkbox"
                                                label={kategori.namaKategori}
                                                disabled={isLoading}
                                                onChange={() => {
                                                    onRemovePos(kategori.id)
                                                    removePosData(kategori.id)
                                                }}
                                            />
                                            <div className="ml-6">
                                            {
                                                kategori.pos.map((pos: any, index: number) =>(
                                                <OptionInput
                                                    key={index}
                                                    id="namaPos" 
                                                    value={pos.id}
                                                    checked={
                                                        selectedPos.some(obj => 
                                                            Object.values(obj).includes(pos.id))
                                                    } 
                                                    name={kategori.id}
                                                    type="radio"
                                                    label={pos.namaPos}
                                                    disabled={isLoading || (pos.panitia !== null && pos.panitia.id !== panitia.id)}
                                                    onChange={() => onSelectedPos(kategori.id, pos.id, pos.namaPos, kategori.namaKategori)}
                                                />
                                            ))}
                                            </div>
                                        </div>
                                        ))
                                    }
                                    </div>
                                    )
                                }
                                </td>
                                
                                <td className='p-3'>
                                {   
                                    panitia.pos.length > 0 
                                    ? (
                                        panitia.pos.map((pos: any) => pos.namaPos).join(", ")
                                    )
                                    : "Belum ada pos"
                                    
                                }
                                </td>
                                <td className="text-center p-3">
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
                                            editMode === panitiaIndex && 
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
                                                    editMode === panitiaIndex 
                                                    ? "hover:bg-green-300"
                                                    : "hover:bg-orange-200 ",
                                                     editMode === panitiaIndex && isError && ValidateCss.buttonDisabled
                                                )}
                                                onClick={() =>onEdit(panitia.id, panitiaIndex)}
                                            >
                                            {   
                                                editMode === panitiaIndex 
                                                ? isLoading ? <Loading/> : <BsCheck2/> 
                                                : <BsPencil/>
                                            }
                                            </span>
                                            {
                                                editMode === panitiaIndex &&
                                                <span 
                                                    className={clsx(`
                                                        p-2 
                                                        rounded-md 
                                                        hover:text-white 
                                                        cursor-pointer
                                                        transition
                                                        hover:bg-orange-200`
                                                    )}
                                                    onClick={onCancel}
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
                                            onClick={() => onDelete(panitia.id, panitiaIndex)}
                                        >
                                            {(isLoading && selectedDelete === panitiaIndex) 
                                            ? <Loading/> 
                                            : <BsTrash/>}
                                        </span>
                                    </div>
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
                    <Button 
                        type='button'
                        icon={ BsPlusLg }
                        disabled= {isLoading}
                        onClick={() => {
                            ShowModal({
                                content: <FormAddPanitia/>, 
                                title:"Tambah Kategori Lomba"
                            })
                        }} 
                    />
                </div>
            </>
            
        }
    </>
    )
}

export default TableUser
'use client'

import Button from '@/app/components/Button'
import axios from 'axios'
import clsx from 'clsx'
import FormAddKategori from '@/app/components/form/FormAddKategori'
import Tooltip from '@/app/components/Tooltip'
import { TableProps } from '@/app/types/tableTypes'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsPencil, BsTrash, BsCheck2, BsPlusLg, BsX, BsPlus } from 'react-icons/bs'
import { useRouter } from "next/navigation"
import { Loading } from '@/app/components/Loading'
import { ShowModal } from '@/app/components/modal/Modal'
import { AlertMessage } from '@/app/types/alertMessage'
import { ValidateMessage } from '@/app/types/validateMesssage'
import { InputPosComponent } from '@/app/interfaces/interfaces'
import { Validate } from '@/app/libs/validate'
import { ValidateCss } from '@/app/css/validate'
import { InputText } from '@/app/components/Input'


const TableKategori:React.FC<TableProps> = ({data}) => {

    // data state
    const [kategoriData, setKategoriData] = useState(data)

    // edit state
    const [editMode, setEditMode] = useState<number | null>(null)
    
    // check state
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isCheckAll, setIsCheckAll] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    
    // delete state
    const [checkAll, setCheckAll] = useState<string[]>([])
    const [selectedDelete, setSelectedDelete] = useState<number | null>()
    const [deletedPos, setDeletedPos] = useState<any[]>([])

    // add input state
    const [inputComponents, setInputComponents] = useState<InputPosComponent[]>([])

    const router = useRouter()

    const onCancel = () =>{
        setKategoriData(data)
        setEditMode(null)
        setDeletedPos([])
        setInputComponents([])
        setIsLoading(false)
        setIsError(false)
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

        await axios.patch(`/api/kategori`, {data: checkAll})
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
        const kategoriId = id

        await axios.delete(`/api/kategori/${kategoriId}`)
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

    // oncheck all save
    const onEdit = async(i: number, id: string) => {
      
        if (editMode === i){
            
            setIsLoading(true)
            const selectedData = kategoriData.filter((selected) => selected.id === id)
            const kategoriId = id
            await axios.patch(`/api/kategori/${kategoriId}`, {
                data: selectedData, 
                deletePos: deletedPos,
                newpos: inputComponents
            })
            .then(() => {
                toast.success(AlertMessage.editSuccess)
                router.refresh()
            })
            .catch(() => {
                toast.error(AlertMessage.editFailed)
            })
            .finally(() => {
                setIsLoading(false)
                setEditMode(null)
                setInputComponents([])
                setDeletedPos([])
            })
        } else {
            setEditMode(i) 
        }
    }

    const onValidate = (e: any, idKategori?: string, idPos?: any) => {
        const { value, name } = e.target;

         const updatedKategoriData = kategoriData.map((kategori) => {
            if (kategori.id === idKategori) {
                if (name == "namaKategori"){
                    
                    kategori.error = []
                    if (value === null || value.trim() === "") {
                        kategori.error.push(ValidateMessage.required)
                        
                    }
                    kategori.namaKategori = value


                    // Check for sameField error separately after updating namaPos
                    const kategoriValue = kategoriData.map((kategoriItem: any) => kategoriItem.namaKategori)
    
                    const duplicateValues = kategoriValue.filter((namaKategori: any, i: number) => 
                        namaKategori && kategoriValue.indexOf(namaKategori) !== i
                    )
    
                    kategoriData.forEach((kategoriItem: any) => {
                        if(value !== "") {
                            kategoriItem.error = []
                        }
                        if (duplicateValues.includes(kategoriItem.namaKategori)) {
                            kategoriItem.error.push(ValidateMessage.sameField)
                        }
                    })

                    const hasError = kategori.error.length > 0
                    setIsError(hasError)

                } else {

                    const updatedPos = kategori.pos.map((pos: any) => {
                        
                        if (pos.id === idPos) {
                            pos.error = []
    
                            if (value === null || value.trim() === "") {
                                pos.error.push(ValidateMessage.required)
                                
                            }
                            pos.namaPos = value
                        }
                        
                        return pos 
                    })
    
                    // Check for sameField error separately after updating namaPos
                    const posValues = updatedPos.map((pos: any) => pos.namaPos)
    
                    const duplicateValues = posValues.filter((namaPos: any, i: number) => 
                        namaPos && posValues.indexOf(namaPos) !== i
                    )
    
                    updatedPos.forEach((pos: any) => {
                        if(value !== ""){
                            pos.error = []
                        }
                        
                        if (duplicateValues.includes(pos.namaPos)) {
                            pos.error.push(ValidateMessage.sameField)
                        }
                    })
    
                    // Check if any pos has error
                    // set state error
                    const hasError = updatedPos.some((pos: any) => pos.error.length > 0);
                    setIsError(hasError);

                    return { ...kategori, pos: updatedPos }
                }

            }

            return kategori
        })


        setKategoriData(updatedKategoriData)
    }

    // add input pos baru
    const addInput = () => {
        // pisah untuk bawa ke server
        const newInputComponent: InputPosComponent = {
            id: `newpos-${inputComponents.length+1}`,
            namaPos: "",
            posFinish: false,
            panitia: null,
            error: [],
        };
        
        setInputComponents((prevInputComponents) => [...prevInputComponents, newInputComponent])
        
        const addNewPos = kategoriData.map((item) => {
            const newPos = {
                id: `newpos-${inputComponents.length+1}`, 
                namaPos: "",
                posFinish: false,
                panitia: null,
                error: []
            }
            return {
                ...item,
                pos: [...item.pos, newPos],
            }
        })
        setKategoriData(addNewPos)
        
        setIsError(true)
    }

    // handle input di pos baru field
    const handleInputChange = (id: string, value: string) => {
        if(id.includes("newpos")) {
            setInputComponents((prevInputComponents) =>
                prevInputComponents.map((input) => (
                    input.id === id 
                    ? { ...input, namaPos: value } 
                    : input
                ))
            )
            console.log(value)
        }

    }
    
    // remove data pos baru
    const onRemovePos = (idPos: string) =>{
        const key:string = "newpos"

        !idPos.includes(key) && setDeletedPos((prev) => [...prev, idPos])

        const updatedData = kategoriData.map((item) => {
            if (item.pos) {
                const filteredPos = item.pos.filter((pos: any) => 
                    pos.id !== idPos
                )
                return { ...item, pos: filteredPos }
            }
            return item;
        })

        updatedData.some((kategori) => {
            kategori.error && kategori.error.length > 0
            ? setIsError(true)
            : setIsError(false)

            kategori.pos.some((pos: any) => {
                pos.error && pos.error.length > 0 
                ? setIsError(true)
                : setIsError(false)
            })    
        })


        setKategoriData(updatedData)
    }

    // remove field pos baru
    const removeInputComponent = (id: string) => {
        if(id.includes("newpos")) {
            setInputComponents((prevInputComponents) =>
                prevInputComponents.filter((input) => input.id !== id)
            )
        }

        onRemovePos(id)
    }

    // handle radio button set sbg finish
    const handlePosFinishChange = (posId: string, i: number) => {
        const updatedKategoriData = kategoriData.map((kategori, index) => {
            if (index === i) {
                return {
                    ...kategori,
                    pos: kategori.pos.map((pos: any) => ({
                        ...pos,
                        posFinish: pos.id === posId,
                    })),
                }
            } else {
                return {
                    ...kategori,
                    pos: kategori.pos.map((pos: any) => ({
                        ...pos,
                        posFinish: false,
                    })),
                }
            }
        })

        const updateAddPosData = inputComponents.map((newpos, index) =>{
            if (index === i) {
                return {
                    ...newpos,
                    posFinish: true
                }
            } else {
                return{
                    ...newpos,
                    posFinish: false
                }
            }
        })

        setKategoriData(updatedKategoriData)
        setInputComponents(updateAddPosData)
    }

    useEffect(() => {
        // ubah format data dari server, tambahkan field error buat validasi
        const newData = data.map((dataItem) =>({
            ...dataItem,
            pos: dataItem.pos.map((pos: any) =>({
                ...pos,
                error: []
            })),
            error: []
        }))
        setKategoriData(newData)

    }, [data])
    
    return (    
    <>
        <div className='flex flex-col gap-2'>
            <div>{"Newpos FIeld : "+JSON.stringify(inputComponents)}</div>
            <div>{"Kategori Data : "+JSON.stringify(kategoriData)}</div>
            {/* <p>{isError ? "error true" : "error false"}</p> */}
        </div>
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
                    <th className="py-1 w-10">#</th>
                    <th className="py-4 text-center w-20">Kategori</th>
                    <th className="py-4 text-center">Panitia</th>
                    <th className="py-4 text-center">Jumlah Pos</th>
                    <th className="py-4 text-center w-64">Pos</th>
                    <th className="py-4 w-10"></th>
                </tr>
            </thead>
            <tbody>
            {
                kategoriData.map((kategori: any, i) => (
                    <tr 
                        key={i} 
                        className={clsx(`
                            border-b 
                            border-zinc-200`,
                            editMode !== null && editMode !== i && "opacity-60 pointer-events-none"
                        )}
                    >
                        <td className="py-1 w-10 text-center">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 checked:bg-blue-400"
                                checked={checkAll.includes(kategori.id)}
                                onChange={(e) => onSingleCheck(e, kategori.id)} 
                            />
                        </td>
                        <td className="text-center border-r border-zinc-100">{i+1}</td>
                        <td className="text-left p-3">
                            <div className='flex flex-col'>
                                <input
                                    name='namaKategori' 
                                    className={clsx(
                                        editMode === i && `
                                        border 
                                        rounded-md 
                                        py-1 px-4
                                        focus:border-orange-300`,
                                        kategori.error && kategori.error.length > 0
                                        ? ValidateCss.borderError
                                        : "border-zinc-200" 
                                    )} 
                                    type="text" 
                                    value={kategori.namaKategori}
                                    readOnly={editMode !== i}
                                    onChange={(e) => onValidate(e, kategori.id, i)}
                                />
                                <span className="text-xs text-rose-400">{kategori.error}</span>
                            </div>
                        </td> 
                        <td className="
                            p-3
                            place-items-center
                            text-center
                        ">
                        {
                            kategori.pos.some((pos: any) => pos.panitia !== null) 
                            ?   (
                                    kategori.pos
                                    .filter((pos: any) => pos.panitia !== null)
                                    .map((pos: any) => pos.panitia.namaPanitia)
                                    .join(", ")
                                )   
                            :   "Belum ada panitia"
                        }
                                
                        </td> 
                        <td className="p-3 text-center">
                            <input
                                name='jumlahPos'
                                className={clsx("w-12 text-center",
                                    editMode === i && `
                                    text-center
                                    border  
                                    border-zinc-200 
                                    rounded-md 
                                    py-1 px-2
                                    focus:border-orange-300`
                                )} 
                                type="text" 
                                value={kategori.pos.length > 0 ? kategori.pos.length : "Belum ada pos"}
                                readOnly={editMode !== i}
                                disabled= {editMode === i}
                            />
                        </td> 
                        <td className={clsx(
                            `text-left 
                            p-3 
                            w-40`,
                            editMode === i && "flex flex-col gap-2 items-center justify-center w-full"
                        )}>
                            {
                                editMode !== i 
                                ? kategori.pos.map((pos: any) => pos.namaPos).join(', ')
                                : kategori.pos.map((pos: any, index:number) => (
                                
                                    <div key={index} className='flex flex-col'>
                                        <div 
                                            className='
                                                flex 
                                                gap-1 
                                                items-center 
                                                w-[full]
                                            '
                                        >
                                            <Tooltip text="Atur sebagai pos finish">
                                                <input 
                                                    type="radio"
                                                    defaultChecked={pos.posFinish}
                                                    onChange={() => handlePosFinishChange(pos.id, i)}
                                                    disabled={isLoading}
                                                    value={1}
                                                    name="posFinish"
                                                />
                                            </Tooltip>
                                            
                                            <InputText
                                                name={`namaPos`} 
                                                className={clsx(`
                                                    border  
                                                    rounded-md 
                                                    py-1 px-4
                                                    focus:border-orange-300`,
                                                    pos.error && pos.error.length > 0 
                                                    ? ValidateCss.borderError
                                                    : "border-zinc-200" 
                                                )} 
                                                type="text" 
                                                value= {pos.namaPos}
                                                placeholder='Nama Pos'
                                                onChange={(e) => {
                                                    onValidate(e, kategori.id, pos.id)
                                                    handleInputChange(kategori.id, e.target.value)
                                                }}
                                                disabled={isLoading}
                                            />
                                        
                                            <Tooltip 
                                                text={
                                                    pos.id.includes("newpos") 
                                                    ? 'cancel'
                                                    : 'Panitia yg bertugas juga akan dihapus dari pos' 
                                                }
                                                className={clsx(
                                                    pos.id.includes("newpos") 
                                                    ? "-top-[20px]"
                                                    : "-top-[45px]"
                                                )}
                                            >
                                                <span 
                                                    className='
                                                        flex items-center
                                                        p-1
                                                        cursor-pointer 
                                                        rounded-md
                                                        hover:bg-rose-500 
                                                        hover:text-white  
                                                    '
                                                    onClick={() => {
                                                        removeInputComponent(pos.id)
                                                        
                                                    }}
                                                >
                                                    {
                                                        pos.id.includes("newpos") 
                                                        ? <BsX/>
                                                        : <BsTrash/>
                                                    }
                                                </span>
                                            </Tooltip>
                                        </div>
                                        <div className='
                                            flex 
                                            flex-col
                                            pl-5
                                        '>
                                            <span className="text-xs text-rose-400">{pos.error}</span>
                                        </div>
                                    </div>
                                ))      
                            }
                            {
                                editMode === i &&
                                <button 
                                    className={clsx(`
                                        flex justify-center
                                        w-20
                                        border
                                        border-zinc-300
                                        cursor-pointer 
                                        p-1 
                                        rounded-md 
                                        hover:bg-indigo-500 
                                        hover:text-white`,
                                        isError && ValidateCss.buttonDisabled
                                    )}
                                    onClick={addInput}
                                >   
                                    <BsPlus />
                                </button>
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
                                    editMode === i && `
                                    border
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
                                            editMode === i 
                                            ? "hover:bg-green-300"
                                            : "hover:bg-orange-200 ",
                                             editMode === i && isError && ValidateCss.buttonDisabled
                                        )}
                                        onClick={() =>onEdit(i, kategori.id)}
                                    >
                                    {   
                                        editMode === i 
                                        ? isLoading ? <Loading/> : <BsCheck2/> 
                                        : <BsPencil/>
                                    }
                                    </span>
                                    {
                                        editMode === i &&
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
                                    onClick={() => onDelete(kategori.id, i)}
                                >
                                    {(isLoading && selectedDelete === i) 
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
                        content: <FormAddKategori/>, 
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

export default TableKategori
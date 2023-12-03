'use client'

import Button from '@/app/components/Button'
import axios from 'axios'
import clsx from 'clsx'
import FormAddKategori from '@/app/components/form/FormAddKategori'
import Tooltip from '@/app/components/Tooltip'
import { TableProps } from '@/app/types/tableTypes'
import { ReactEventHandler, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsPencil, BsTrash, BsCheck2, BsPlusLg, BsX, BsPlus } from 'react-icons/bs'
import { useRouter } from "next/navigation"
import { Loading } from '@/app/components/Loading'
import { ShowModal } from '@/app/components/modal/Modal'
import { AlertMessage } from '@/app/types/alertMessage'
import { ValidateMessage } from '@/app/types/validateMesssage'
import { PosData, InputPosComponent } from '@/app/interfaces/DataProps'
import Validate from '@/app/libs/validate'
import { ValidateCss } from '@/app/css/validate'


const TableKategori:React.FC<TableProps> = ({data}) => {

    const [kategoriData, setKategoriData] = useState(data)

    const [editMode, setEditMode] = useState<number | null>(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isCheckAll, setIsCheckAll] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)

    const [checkAll, setCheckAll] = useState<string[]>([])

    const [selectedDelete, setSelectedDelete] = useState<number | null>()
    const [deletedPos, setDeletedPos] = useState<any[]>([])

    const [inputComponents, setInputComponents] = useState<InputPosComponent[]>([]);
    const [dataPanitia, setDataPanitia] = useState<any>([])

    const router = useRouter()


    const onCancel = () =>{
        setKategoriData(data)
        setEditMode(null)
        setDeletedPos([])
        setInputComponents([])
        setIsLoading(false)
        setIsError(false)
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

    // oncheck all save
    const onEdit = async(i: number, id: string) => {
        // get data panitia
        try {
            const getPanitia = await axios.get("/api/panitia")
            setDataPanitia(getPanitia)
        } catch (error) {
            toast.error(AlertMessage.getFailed)
        }
        

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

    const onChangeEdit = (e?: any, KategoriId?: any, posId?: any) =>{
        const { name, value } = e.target

        const editedData = kategoriData.map((item) => {
    
                // cek apakah newpos yg baru atau newpos yg diedit
                if (posId.includes("newpos") && item.id === KategoriId && name) {

                    const isExist = item.pos.some((dataPos: any) => dataPos.id === posId)
                    
                    // if (!isExist && value != '') {
                    if ((posId === `newpos-${inputComponents.length}`) && !isExist && value != '') {

                        const newPos = {
                            id: `newpos-${inputComponents.length}`, 
                            namaPos: value,
                            posFinish: false,
                            error: []
                        }
                        return {
                            ...item,
                            pos: [...item.pos, newPos],
                        }
                    } else {
                        const updatedPos = item.pos.map((pos: any) => {
                            //update jika id nya sama dan valuenya beda
                            if (pos.id === posId && value !== pos.namaPos) {
                                return { ...pos, [name]: value }
                            }
                            return pos
                        })
    
                        console.log("LAMA")
                        return { 
                            ...item, 
                            pos: updatedPos 
                        }
                    }

                }
            
            return item
        })
        setKategoriData(editedData)
    }

    const onValidate = (e: any, idKategori?: string, idPos?: any, index?: number) => {
        const { value, name } = e.target;

         const updatedKategoriData = kategoriData.map((kategori) => {
            if (kategori.id === idKategori) {
                const updatedPos = kategori.pos.map((pos: any) => {
                    pos.error = []

                    if (pos.id === idPos) {

                        if (value === null || value.trim() === "") {
                            pos.error.push(ValidateMessage.required)
                            
                        }
                        console.log("Pos ID DATA :"+pos.id)
                        console.log("Pos ID Params :"+idPos)
                        pos.namaPos = value
                    }
                    
                    return pos 
                })

                // Check for sameField error separately after updating namaPos
                const namaPosValues = updatedPos.map((pos: any) => pos.namaPos)

                const duplicateValues = namaPosValues.filter((namaPos: any, i: number) => 
                    namaPos && namaPosValues.indexOf(namaPos) !== i
                )

                updatedPos.forEach((pos: any) => {
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

            return kategori
        })

        

        setKategoriData(updatedKategoriData)
    }


    

    const addInput = () => {
    
            const newInputComponent: InputPosComponent = {
                id: `newpos-${inputComponents.length+1}`,
                value: "",
                posFinish: false,
                error: [],
            };
            
            setInputComponents((prevInputComponents) => [...prevInputComponents, newInputComponent])
            setIsError(true)
    }

    const handleInputChange = (id: string, value: string) => {
        setInputComponents((prevInputComponents) =>
            prevInputComponents.map((input) => (
                input.id === id ? { ...input, value } : input
            ))
        )
    }
    
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
        });

        setKategoriData(updatedData)
    }

    const removeInputComponent = (id: string) => {
        setInputComponents((prevInputComponents) =>
            prevInputComponents.filter((input) => input.id !== id)
        );

        onRemovePos(id)
        // setIsError(false)
    }

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
            <p>{isError ? "error true" : "error false"}</p>
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
                    <th className="py-4 text-center w-20">Nama Kategori</th>
                    <th className="py-4 text-center">Nama Panitia</th>
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
                                // value={item.id} 
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
                                    onChange={(e) => onChangeEdit(e, kategori.id)}
                                />
                                <span className="text-xs text-rose-400">{ValidateMessage.required}</span>
                            </div>
                        </td> 
                        <td className="
                            p-3
                            place-items-center
                            text-center
                        ">
                            {
                                kategori.panitia.length < 1 
                                ? "Belum ada panitia" 
                                : kategori.panitia.map((panitia: any) => panitia.namaPanitia).join(', ')
                            }
                                <div className='grid grid-cols-3 gap-x-2 gap-y-1'>
                            {
                                editMode === i && dataPanitia.length > 0 &&
                                dataPanitia.map((item: any, i: number) =>(
                                    <div key={i} className='space-x-2'>
                                        <input 
                                            id="namaPanitia" 
                                            name="namaPanitia" 
                                            type="checkbox" 
                                            value={item.id}
                                            checked={item.kategoriId.include(item.id)} 
                                        />
                                        <label htmlFor="namaPanitia">Panitia 1</label>
                                    </div>
                                ))
                            }                            
                            </div>
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
                                <>
                                    {
                                        !pos.id.includes("newpos") &&
                                        <div className='flex flex-col'>
                                            <div 
                                                key={index} 
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
                                                        // checked={isCheckPos === index || pos.posFinish}
                                                        onChange={() => handlePosFinishChange(pos.id, i)}
                                                        disabled={isLoading}
                                                        value={1}
                                                        name="posFinish"
                                                    />
                                                </Tooltip>
                                                
                                                <input
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
                                                        onValidate(e, kategori.id, pos.id, index)
                                                    }}
                                                    disabled={isLoading}
                                                />
                                            
                                                <Tooltip 
                                                    text='Panitia yg bertugas juga akan dihapus dari pos'
                                                    className='-top-[45px]'
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
                                                        onClick={() => onRemovePos(pos.id)}
                                                    >
                                                        {<BsTrash/>}
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
                                    }
                                </>
                                ))      
                            }
                            {
                                editMode === i &&
                                <>
                                {
                                    inputComponents.map((input, index) => (
                                    <div 
                                        key={index} 
                                        className='flex gap-1 items-center w-full'
                                    >
                                        <Tooltip text="Atur sebagai pos finish">
                                            <input 
                                                type="radio"
                                                disabled={isLoading}
                                                onChange = {() => handlePosFinishChange(input.id, index)}
                                                value={1}
                                                name="posFinish"
                                            />
                                        </Tooltip>
                                        <input
                                            name={`namaPos`} 
                                            className={clsx(`
                                                border  
                                                rounded-md 
                                                py-1 px-4
                                                focus:border-orange-300`,
                                                isError 
                                                ? ValidateCss.borderError
                                                : "border-zinc-200" 
                                            )}
                                            type="text"
                                            value={input.value} 
                                            placeholder='Nama Pos'
                                            disabled={isLoading}
                                            onChange={(e) => {
                                                handleInputChange(input.id, e.target.value)
                                                onValidate(e, kategori.id, input.id, index)
                                                onChangeEdit(e, kategori.id, input.id)

                                            }}

                                        />
                                        {
                                            input !== undefined && input.error.map((errorItem: string, i: number) =>{
                                                <span className="text-xs text-rose-400">{errorItem}</span>
                                            }) 
                                        }
                                        <Tooltip 
                                            text='Cancel'
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
                                                onClick={() => removeInputComponent(input.id)}
                                            >
                                                {<BsX/>}
                                            </span>
                                        </Tooltip>
                                    </div>
                                    ))
                                }
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
                                            isError && ValidateCss.disabled
                                        )}
                                        onClick={addInput}
                                    >   
                                        <BsPlus />
                                    </button>
                                
                                
                                </>
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
                                             editMode === i && isError && ValidateCss.disabled
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
'use client'

import { useState } from "react"
import { createRoot } from "react-dom/client"
import { IoCloseOutline } from "react-icons/io5"
import clsx from "clsx"

interface ModalProps{
    isOpen?: boolean
    title?: string
    content?: any
    okBtnText?: string
    isOk?: () => void
}

function Modal(props: ModalProps){
    const [isOpen, setIsOpen] = useState(props.isOpen)
    return (
        <div
            role="dialog" 
            aria-modal="true"
            className={clsx(`
                relative
                z-10`,
                !isOpen && "hidden"
            )}
        >
            
            <div className="
                fixed 
                inset-0 
                bg-zinc-900
                bg-opacity-40
                transition-opacity
            ">
                <div className="
                    fixed
                    inset-0
                    z-10
                    overflow-y-auto
                ">

                    <div className="
                        flex
                        justify-center
                        items-center
                        min-h-full 
                        text-center
                    ">
                        
                        <div className="
                            relative
                            p-4
                            transform
                            shadow-xl
                            rounded-md
                            transtion-all
                            bg-white
                        ">
                            <span
                                onClick={() =>setIsOpen(false)} 
                                className="
                                    absolute
                                    -top-3
                                    -right-3
                                    rounded-full
                                    cursor-pointer
                                    p-1
                                    text-2xl
                                    shadow-lg
                                    z-10
                                    text-white   
                                    bg-rose-500
                                    hover:bg-rose-600
                                "
                            >
                                <IoCloseOutline/>
                            </span>
                            <p className="font-bold text-slate-600 text-left mb-2">
                            {
                                props.title || "Title"
                            }
                            </p>
                            <hr />
                            {/* Content Alert */}
                            <div className="w-full p-5">
                                
                                {
                                    props.content || "Messages Alert"
                                }
                                {props.okBtnText && (

                                    <div className="space-x-3 mt-5">
                                        
                                        <button
                                            className={clsx(`
                                                py-1
                                                px-5
                                                rounded-md
                                                text-white
                                                bg-blue-500
                                                hover:bg-blue-400
                                                `,
                                                props.isOk && "hidden"
                                            )}
                                            onClick={() => {
                                                props.isOk && props.isOk()
                                                setIsOpen(false)
                                            }}
                                        >
                                            {props.okBtnText || "Ok"}
                                        </button>
                                        
                                    </div>
                                )
                                    
                                }
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export function ShowModal(props: ModalProps){
    const alert = document.createElement("div")
    alert.id = "alert"
    document.body.appendChild(alert)
    const root = createRoot(alert)

    root.render(
        <Modal 
            isOpen={true}
            title={props.title}
            content={props.content}
            okBtnText={props.okBtnText}
            isOk={props.isOk}
        />
    )
}
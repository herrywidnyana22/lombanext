// import React from 'react'

// const changeNValidateInputPos = () => {

//      const onChangeEdit = (e?: any, KategoriId?: any, posId?: any) =>{
//         const { name, value } = e.target

//         const editedData = kategoriData.map((item) => {

//                 // if (posId === undefined && item.id === KategoriId && name) {
//                 //     return { ...item, [name]: value }
//                 // }
//                 // if (!posId.includes("newpos") && item.id === KategoriId && name) {
//                 //     const updatedPos = item.pos.map((pos: any) => {
//                 //         if (pos.id === posId) {
//                 //             return { ...pos, [name]: value }
//                 //         }
//                 //         return pos;
//                 //     })
                    
//                 //     return { 
//                 //         ...item, 
//                 //         pos: updatedPos 
//                 //     }
//                 // }
                
//                 // cek apakah newpos yg baru atau newpos yg diedit
//                 if (posId.includes("newpos") && item.id === KategoriId && name) {

//                     const isExist = item.pos.some((dataPos: any) => dataPos.id === posId)
                    
//                     // if (!isExist && value != '') {
//                     if ((posId === `newpos-${inputComponents.length}`) && !isExist && value != '') {

//                         const newPos = {
//                             id: `newpos-${inputComponents.length}`, 
//                             namaPos: value,
//                             posFinish: false,
//                             error: []
//                         }
//                         return {
//                             ...item,
//                             pos: [...item.pos, newPos],
//                         }
//                     } else {
//                         const updatedPos = item.pos.map((pos: any) => {
//                             //update jika id nya sama dan valuenya beda
//                             if (pos.id === posId && value !== pos.namaPos) {
//                                 return { ...pos, [name]: value }
//                             }
//                             return pos
//                         })
    
//                         console.log("LAMA")
//                         return { 
//                             ...item, 
//                             pos: updatedPos 
//                         }
//                     }

//                 }

//             // }
            
//             return item
//         })
//         setKategoriData(editedData)
//     }

//     // const onValidate = (e: any, idKategori?: string, idPos?: string, index?: number) =>{
//     //     const { value } = e.target

//     //     const posData = kategoriData.find((item) => item.id === idKategori)?.pos || []
        
//     //     setDataPos(data)

//     //     // if(value === "" || value === null || value=== undefined ){
//     //     //     posData[index].error.push(ValidateMessage.required);
//     //     // }

//     //     posData.forEach((field: any) => {
//     //         // validasi rule
//     //         // 1. jika value kosong, msg = "wajib isi"
//     //         // 2. jika value field aktif = pos di id lain maka set msg = "tidak boleh sama" di kedua field
//     //         // jika tidak sama maka update msg = ""
            
//     //         field.error= []

//     //         if(field.id === idPos){  
//     //             if(value == null || value.trim() == ''){   
//     //                 field.error.push(ValidateMessage.required)
//     //             }
//     //         }

//     //         // cek apakah namanya sama atau mirip
//     //         if(field.namaPos == value){
//     //             // field.error= []
//     //             field.error.push(ValidateMessage.sameField)


//     //             posData.map((otherField: any) => {
//     //                 if(otherField.id === idPos){
//     //                     // otherField.error= []
//     //                     otherField.error.push(ValidateMessage.sameField)
//     //                     console.log("SAMA")
//     //                 }
//     //             });
//     //         }

//     //         // if(field.id === idPos){
//     //         //     posData.forEach((otherField: any) => {
//     //         //         if(otherField.id !== idPos && otherField.namaPos === field.namaPos){
//     //         //             field.error= []
//     //         //             otherField.error.push(ValidateMessage.sameField)
//     //         //         }
//     //         //     });
//     //         // }
//     //     })

//     //     console.log(posData)
//     // }

//     // const onValidate = (e: any, idKategori?: string, idPos?: string, index?: number) =>{
//     //     const { value } = e.target

        
//     //     kategoriData.map((kategori) =>{
//     //         if (kategori.id === idKategori){
//     //             kategori.pos.map((pos: any) => {
                    
//     //                 if(pos.id === idPos){  
//     //                     pos.error= []

                        
//     //                     if(value === null || value.trim() === ""){ 
//     //                         pos.error.push(ValidateMessage.required)
//     //                     } 
//     //                 }else if(pos.namaPos == value && value !== ""){
//     //                     pos.error.push(ValidateMessage.sameField)
    
    
//     //                     kategori.pos.map((field: any) => {

//     //                         if(field.id === idPos){
//     //                             field.error.push(ValidateMessage.sameField)
//     //                         }
                            
//     //                     });
//     //                 }
//     //             })
//     //         }

//     //     })

//     //     // console.log(validateData)
//     //     // setKategoriData(validateData)
//     // }

//   return (
//     <div>changeNValidateInputPos</div>
//   )
// }

// export default changeNValidateInputPos
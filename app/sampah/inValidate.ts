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
export interface PosData {
  id: string
  namaPos: string
  posFinish: boolean
  error?: string
}

export interface KategoriData {
  id: string
  namaKategori: string
  createAt: string
  updateAt: string
  pos: PosData[]
  panitia: any[]
  error?: string
}
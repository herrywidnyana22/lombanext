export interface PosData {
  id: string
  namaPos: string
  posFinish: boolean
  error?: string
}

export interface InputPosComponent {
    id: string
    namaPos: string
    posFinish?: boolean
    panitia: null
    error: any
}

interface KategoriData {
  id: string
  namaKategori: string
  createAt: string
  updateAt: string
  pos: PosData[]
  panitia: any[]
  error?: string
}
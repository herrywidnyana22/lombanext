export interface InputPosComponent {
  id: string
  name: string
  posFinish?: boolean
  value?: string
  panitia: null
  error: any
}
export interface InputPesertaComponent {
  id: string;
  [key: string]: string | any[]
}

export interface InputTimeProps {
  hour?: string
  minute?: string
  second?: string
  millisecond?: string
}

export interface TimeFormat {
    id: string;
    [key: string]: string | InputTimeProps[]
}

import FormInputPeserta from '@/app/components/form/FormInputPeserta'
import getDataMenu from '@/app/actions/getDataMenu'
import {format, formatURL} from '@/app/libs/Formater'
import clsx from 'clsx'
import TablePos from './component/TablePos'
import TableUser from './component/TableUser'
import TableKategori from './component/TableKategori'
import TablePeserta from './component/TablePeserta'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import getCurrentUser from '@/app/actions/getCurrentUser'
import { Role } from '@prisma/client'
import { getPos, getPosName } from '@/app/actions/getPos'


interface menuParams{
  menuName: any
}

const TableComponent: any = {
  panitia: TableUser,
  peserta: TablePeserta,
  kategori: TableKategori,
  pos: TablePos
}

const Data = async({params}: {params: menuParams}) => {
  
  const currentUser = await getCurrentUser()
  const role = currentUser?.role
  const allPos = await getPos(params.menuName)
  const posName:any = await getPosName(params.menuName)
  const data = await getDataMenu(params.menuName)

  return (
  <>
    <div 
      className="
        bg-white
        rounded-lg
        p-6"
    >
      <div className="
        p-4
      ">
        <h2 className={clsx(`
            text-center 
            font-bold 
            text-xl 
            text-slate-600`,
            data && data.length < 1 && "font-light"
          )}
        >   
          
            {
              data && data.length < 1 
              ? "Belum ada data" 
              : `Tabel ${formatURL(params.menuName)}`
            }
        </h2>
        { role === Role.ADMIN 
          &&
            (
              (typeof TableComponent[params.menuName] !== "undefined") && data && data.length > 0 
              ? React.createElement(TableComponent[params.menuName], {data})
              : null
            )
        }
        {
          role === Role.PANITIA 
          && 
          (
            <TablePeserta data={data} pos={allPos} posId={posName}/>
          )
        }
      </div>
        
    </div>
    {/* {JSON.stringify(posName)} */}
    { role && role === Role.PANITIA && (
      <div 
        className="
          bg-white
          rounded-lg
          p-6"
      >
        <div className="
          p-4
        ">
          <h2 className="
              text-center 
              font-bold 
              text-xl 
              text-slate-600"
          >
              {`${posName?.namaPos} (${posName?.kategori.namaKategori})`}
          </h2>
          <FormInputPeserta kategori={params.menuName} posName={posName}/>
        </div>
      </div>
    )}
  </>
  )
}

export default Data
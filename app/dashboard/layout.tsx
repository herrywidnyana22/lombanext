import Header from "../components/Header"
import Menu from "../components/menu/Menu"
import Card from "../components/card/Card"
import ToasterContext from "../context/ToasterContext"
import getCurrentUser from "../actions/getCurrentUser"
import getMenu from "../actions/getMenu"


export const metadata ={
    title: "Dashboard"
}

export default async function RootLayout({children}:{children: React.ReactNode}) {
  const currentUser = await getCurrentUser()
  const menuPanitia = await getMenu()
  const menuPanitiaObject = menuPanitia ? JSON.parse(JSON.stringify(menuPanitia)) : null;

  return (
        <div className="
            container
            flex
            flex-col
            gap-6
            mx-auto
            mb-10
        ">
            <ToasterContext/>
            <Header 
              // @ts-ignore
              user={currentUser}
            />
            <Card/>
            
            <Menu 
              // @ts-ignore
              currentUser={currentUser && currentUser}
              menuItem = {menuPanitiaObject}
            />
            {children}
        </div>
  )
}

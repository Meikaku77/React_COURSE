import { Outlet, Link, useLocation, NavLink } from "react-router-dom"


const Layout = () => {

  const location = useLocation()


  return (
    <div>
        <div className="md:flex md:min-h-screen">
          <aside className="md:w-1/4 bg-blue-900 px-5 py-10">
                  <h1 className="text-white font-bold text-4xl font-serif text-center">CRM - CLIENTES</h1>
                  <nav className="mt-10 text-center">
                    <Link to="/" className={`${location.pathname === '/'? "text-blue-200" : "text-white"} text-2xl font-bold text-white font-serif hover:text-blue-200 cursor-pointer block py-4`}>Clientes</Link>
                    
                  <NavLink
                    className={({isActive})=>isActive? "text-blue-200 text-2xl font-bold font-serif hover:text-blue-200 cursor-pointer block py-4" 
                    : "text-white text-2xl font-bold font-serif hover:text-blue-200 cursor-pointer block py-4"}
                    to={"/clientes/nuevo"}
                  >Nuevo Cliente</NavLink>
                  </nav>
          </aside>

        <main className="md:w-3/4 py-10 md:h-screen overflow-scroll"> 
          <Outlet />

        </main>

        </div>

    </div>
  )
}

export default Layout
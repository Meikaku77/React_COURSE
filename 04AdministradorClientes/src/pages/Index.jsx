import {useLoaderData} from 'react-router-dom'
import Cliente from '../components/Cliente';
import { obtenerClientes } from '../data/clientes';


export function loader(){

  const clientes= obtenerClientes()
  return clientes
}

const Index = () => {

  const clientes = useLoaderData()



  return (
    <>
      <h1 className="font-black text-3xl text-blue-900 font-serif ml-4">Clientes</h1>
      <h3 className="font-bold text-xl font-serif ml-4">Administra tus clientes</h3>

      {clientes.length ?(
        <table className="w-full bg-white shadow mt-5 table-auto">
          <thead className="bg-blue-800 text-white font-bold text-lg">
              <tr>
                <th className="p-2">Cliente</th>
                <th className="p-2">Contacto</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
              <tbody>
                {clientes.map(cliente=>(
                  <Cliente cliente={cliente} key={cliente.id}/>
                ))}
              </tbody>

          

        </table>
      )
      : (
        <p className="text-center font-bold text-xl mt-10">No hay clientes aún</p>
      ) }




    </>
  )
}

export default Index
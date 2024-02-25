import {useNavigate, Form, redirect} from 'react-router-dom'
import { eliminarCliente } from '../data/clientes'


export async function action ({params}){
    
    eliminarCliente(params.clienteId)

    return redirect('/')
}



const Cliente = ({cliente}) => {

    const {nombre, empresa, email, telefono, id} = cliente

    const navigate= useNavigate()

  return (
     <tr className="border-b">
        <td className='p-6 text-center space-y-2'>
            <p className="font-bold text-xl">{nombre}</p>
            <p>{empresa}</p>
        </td>

        <td className="p-6 text-center">
            <p className="text-gray-600">Email:  <span className="text-gray-800 font-bold uppercase">{email}</span></p>
            <p>Tlf: {telefono}</p>
        </td>

        <td className="text-center">
            <button
            type="button"
            className="font-bold uppercase bg-blue-700 hover:bg-blue-800 transition-all p-3 rounded text-white"
            onClick={()=> navigate(`/clientes/${id}/editar`)}>
                Editar
            </button>

            <Form
                method="post"
                action={`clientes/${id}/eliminar`}
            >

                <button
                type="submit"
                className="font-bold uppercase bg-red-700 hover:bg-red-800 transition-all p-3 rounded text-white ml-4">
                    Eliminar
                </button>

            </Form>

        </td>

     </tr>
  )
}

export default Cliente
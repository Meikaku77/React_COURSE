import {useNavigate, Form, useActionData, redirect} from 'react-router-dom'
import Formulario from '../components/Formulario'
import Error from '../components/Error'
import { agregarCliente } from '../data/clientes'

export async function action({request}){

  const formData = await request.formData() 

  const datos = Object.fromEntries(formData)

  const email = formData.get('email')

  const errores= []

  if(Object.values(datos).includes("")){
    errores.push('Todos los campos son obligatorios')
  }
  
  let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
  
  if(!regex.test(email)){
    errores.push('El email no es válido')
  }

  if(Object.keys(errores).length){
    return errores
  }

  await agregarCliente(datos)

  return redirect('/')
}


const NuevoCliente = () => {

  const navigate= useNavigate()

  const errores = useActionData()

  return (
    <>
     <div className="flex justify-between">
        <h1 className="ml-4 font-bold text-4xl font-serif text-blue-700">Nuevo Cliente</h1>
      <button
        type="button"
        className="bg-blue-700 text-white font-serif font-bold mr-8 rounded p-3 hover:bg-blue-800"
        onClick={()=>navigate('/')}>
          VOLVER
        </button>

      </div>
      <div>
        {errores?.length && errores.map((error, i)=> <Error key={i}>{error}</Error>)}
          <Form
           method='post'
           noValidate
          >
            <Formulario />
            <input type="submit" 
             className="mt-5 rounded bg-blue-700 p-3 uppercase text-white font-bold text-center ml-20 hover:bg-blue-800" value="Registrar Cliente"/>
          </Form>
      </div>
    
    </>
  )
}

export default NuevoCliente
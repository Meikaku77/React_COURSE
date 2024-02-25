import { actualizarCliente, obtenerCliente } from "../data/clientes"
import { Form, useNavigate, useLoaderData, useActionData, redirect } from "react-router-dom"
import Formulario from "../components/Formulario"
import Error from "../components/Error"


export async function loader({params}){


    const cliente= await obtenerCliente(params.clienteId)

    if(Object.values(cliente).length == 0){
        throw new Response('', { //valor inicial toma un body, lo dejo vacío
            status: 404,
            statusText: "No hay resultados"
        })
    }

    return cliente
}


export async function action({request, params}){
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
  
    await actualizarCliente(params.clienteId,datos)
  
    return redirect('/')
}

const EditarCliente = () => {

    const navigate= useNavigate()
    const cliente= useLoaderData()
    const errores = useActionData()

  return (
    <>
    <div className="flex justify-between">
       <h1 className="ml-4 font-bold text-4xl font-serif text-blue-700">Editar Cliente</h1>
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
           <Formulario cliente ={cliente}/>
           <input type="submit" 
            className="mt-5 rounded bg-blue-700 p-3 uppercase text-white font-bold text-center ml-20 hover:bg-blue-800" value="Editar Cliente"/>
         </Form>
     </div>
   
   </>
  )
}

export default EditarCliente
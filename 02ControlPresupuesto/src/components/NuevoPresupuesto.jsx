import {useState} from 'react'
import Mensaje from './Mensaje'

const NuevoPresupuesto = ({presupuesto, setPresupuesto, setIsValidPresupuesto}) => {

    const [mensaje, setMensaje]= useState('')

    const handlePresupuesto = (e)=>{
        e.preventDefault()
        
        if(!presupuesto || presupuesto < 0 ){
            setMensaje("No es un presupuesto válido")
            return
        }
            setMensaje("")
            setIsValidPresupuesto(true)
        
   
    }

  return (
    <div>
        <h2 className="text-2xl font-bold text-white text-center mt-3">Nuevo Presupuesto</h2>
        <form onSubmit={handlePresupuesto}>

            <div className="text-center mt-3">
    
                <input type="number"
                     className="rounded py-2 mb-3 px-9 text-center"
                     placeholder="Añade tu presupuesto"
                     value={presupuesto}
                     onChange={(e)=>setPresupuesto(Number(e.target.value))}/>
            </div>

                <div className="text-center">
                    <input type="submit" value="Agregar" className="text-center rounded p-3 bg-blue-300 font-bold text-xl text-white" />

                </div>
                     {mensaje && <Mensaje tipo="error">{mensaje}</Mensaje>}
        </form>
    </div>
  )
}

export default NuevoPresupuesto
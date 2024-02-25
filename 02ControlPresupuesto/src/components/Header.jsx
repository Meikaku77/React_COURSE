import React from 'react'
import ControlPresupuesto from './ControlPresupuesto'
import NuevoPresupuesto from './NuevoPresupuesto'

const Header = ({presupuesto, setPresupuesto, isValidPresupuesto, setIsValidPresupuesto, gastos, setGastos}) => {
  return (
    <div className="bg-indigo-600 w-full py-8">
         <h1 className="text-4xl text-white font-bold text-center align-center">Control de Gastos</h1>

         {isValidPresupuesto ? (
            <ControlPresupuesto presupuesto={presupuesto} gastos={gastos} setGastos={setGastos} setPresupuesto={setPresupuesto}
            setIsValidPresupuesto={setIsValidPresupuesto}/>
            ):(
                <NuevoPresupuesto 
                    presupuesto={presupuesto}
                    setPresupuesto={setPresupuesto}
                    setIsValidPresupuesto={setIsValidPresupuesto}/>
            )}
            
    </div>
  )
}

export default Header
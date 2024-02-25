import React from 'react'
import Gasto from './Gasto'

const ListadoGastos = ({gastos, setGastoEditar, eliminarGasto, gastosFiltrados, filtro}) => {
  return (
    <div className="w-4/6 mx-auto mt-8 bg-gray-50 rounded-xl shadow-xl">
        <h3 className="text-gray-600 font-bold text-4xl block mb-4 text-center">{gastos.length > 0 ? "Gastos": "No hay gastos aún..."}</h3>

      {filtro ? (

        <>
          <h2 className="text-gray-700 font-bold text-center">{gastosFiltrados.length ? "": "No hay gastos"}</h2>
           {gastosFiltrados.map(gasto=>(
            <Gasto gasto={gasto} key={gasto.id} setGastoEditar={setGastoEditar} eliminarGasto={eliminarGasto} />
        
            ))}
        </>

      ): (
        <>
         <h2 className="text-gray-700 font-bold text-center">{gastos.length ? "": "No hay gastos"}</h2>
        {gastos.map(gasto=>(
        <Gasto gasto={gasto} key={gasto.id} setGastoEditar={setGastoEditar} eliminarGasto={eliminarGasto} />
          
        ))}
        </>
      )}
    </div>
  )
}

export default ListadoGastos
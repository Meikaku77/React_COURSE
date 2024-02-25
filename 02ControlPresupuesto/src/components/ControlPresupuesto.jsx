import {useEffect, useState} from 'react'
import {CircularProgressbar} from 'react-circular-progressbar'
import "react-circular-progressbar/dist/styles.css"

const ControlPresupuesto = ({presupuesto, gastos, setGastos, setPresupuesto, setIsValidPresupuesto}) => {


    const [disponible, setDisponible]= useState(0)
    const [gastado, setGastado]= useState(0)

  const formatearCantidad = (cantidad)=>{
    return cantidad.toLocaleString('en-US', {
      style: 'currency',
      currency:'USD'
  })
  }

  useEffect(()=>{

    const totalGastado= gastos.reduce((total, gasto)=> gasto.cantidad +total, 0) //total es el acumulador, gasto.cantidad la cantidad a sumar al total

    setGastado(totalGastado)

    const totalDisponible = presupuesto - totalGastado


    setDisponible(totalDisponible)

  }, [gastos])

  const handleReset = ()=>{
    const resultado= confirm('¿Deseas reiniciar presupuesto y gastos?')
    
    if(resultado){
      setGastos([])
      setPresupuesto(0)
      setIsValidPresupuesto(false)
    }
    
  }

  return (
    <div className="w-1/2 mx-auto bg-gray-100 rounded-xl py-6 shadow-2xl mt-4">

        <div className="text-center mx-auto mt-4 align-items">

            <div>
                <span className="text-indigo-700 font-bold text-2xl ">Presupuesto: </span> 
                <p className="font-bold text-center">{formatearCantidad(presupuesto)}</p>
            </div>
            <div className="mt-4">
                <span className="text-indigo-700 font-bold text-2xl">Disponible: </span> 
                <p className="font-bold text-center">{formatearCantidad(disponible)}</p>
            </div>
            <div className="mt-4">
                <span className="text-indigo-700 font-bold text-2xl">Gastado: </span> 
                <p className="font-bold text-center">{formatearCantidad(gastado)}</p>
            </div>
            <button className="rounded text-white bg-red-700 uppercase font-bold text-xl py-2 px-2 mt-3"
            onClick={handleReset}>Resetear App</button>
        </div>
    </div>
  )
}

export default ControlPresupuesto
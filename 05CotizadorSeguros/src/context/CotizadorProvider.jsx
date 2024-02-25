import { createContext, useState } from "react"
import { obtenerDiferenciaYear, calcularMarca,calcularPlan, formatearDinero } from "../helpers"


const CotizadorContext = createContext()


const CotizadorProvider = ({children}) => {

  const [datos, setDatos] = useState({
    marca:"",
    year:"",
    plan:""
  })

  const [resultado, setResultado] = useState(0)

  const handleChangeDatos=(e)=>{
      setDatos({
        ...datos,
        [e.target.name]: e.target.value
      })
  }

  const [error, setError] = useState('')


  const cotizarSeguro=()=>{
    let resultado = 2000

  const diferenciaYears=  obtenerDiferenciaYear(datos.year)

  resultado -= ((diferenciaYears * 3) * resultado) / 100 

    resultado *=  calcularMarca(datos.marca)
   
    resultado *= calcularPlan(datos.plan)

    resultado.toFixed(2)

    resultado = formatearDinero(resultado)

    setResultado(resultado)

  }


  return (
    
    <CotizadorContext.Provider value={{
      handleChangeDatos,
      datos,
      error, 
      setError,
      cotizarSeguro, resultado

    }}>
        {children}
    </CotizadorContext.Provider>
  )
}

export {
    CotizadorProvider
}

export default CotizadorContext
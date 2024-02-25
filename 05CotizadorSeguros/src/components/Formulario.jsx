import { MARCAS, YEARS, PLANES } from "../constants"
import { Fragment } from "react"
import useCotizador from "../hooks/useCotizador"
import Error from "./Error"

const Formulario = () => {

    const {handleChangeDatos, datos, error, setError, cotizarSeguro} = useCotizador()

    const handleSubmit=(e)=>{
        e.preventDefault()
        if(Object.values(datos).includes('')){
            setError('Error: todos los campos son obligatorios')
            return
        }

        setError('')
        cotizarSeguro()

    }

  return (
    <>
        {error && <Error />}

        <form className="my-5" onSubmit={handleSubmit}>
            <div className="my-3">

                <label className="block mb-3 font-bold text-gray-700 uppercase">
                    Marca
                </label>
                <select name="marca" id=""
                className='w-full p-3 bg-white border border-gray-200'
                onChange={e=> handleChangeDatos(e)}
                value={datos.marca}>

                    <option value="">--Selecciona marca</option>
                    {MARCAS.map((marca)=>(
                        <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                    ))}
                </select>

            </div>
             <div className="my-3">

                <label className="block mb-3 font-bold text-gray-700 uppercase">
                    AÑO
                </label>
                <select name="year" id=""
                className='w-full p-3 bg-white border border-gray-200'
                onChange={e=> handleChangeDatos(e)}
                value={datos.year}>

                    <option value="">--Selecciona año</option>
                {YEARS.map(year=>(
                    <option key={year}>{year}</option>
                ))}

                </select>

            </div>
             <div>

                <label className="block mb-3 font-bold text-gray-700 uppercase">
                    PLANES
                </label>
                <div className="flex gap-3 items-center">

                    {PLANES.map(plan=>(
                        <Fragment key={plan.id}>
                            <label>{plan.nombre}</label>
                            <input 
                            type="radio" 
                            name="plan"
                            value={plan.id}
                            onChange={e=> handleChangeDatos(e)}/>
                        </Fragment>
                    ))}
                </div>
            </div>
            <input type="submit" value="COTIZAR" className="bg-yellow-700 rounded-xl shadow-xl p-3 mt-8 w-full text-white font-black text-xl"/>

        </form>
    </>
  )
}

export default Formulario
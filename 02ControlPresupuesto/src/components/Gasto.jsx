
import { formatearFecha } from '../helpers'

import IconoAhorro from '../img/icono_ahorro.svg'
import IconoCasa from '../img/icono_casa.svg'
import IconoComida from '../img/icono_comida.svg'
import IconoGastos from '../img/icono_gastos.svg'
import IconoOcio from '../img/icono_ocio.svg'
import IconoSalud from '../img/icono_salud.svg'
import IconoSubscripciones from '../img/icono_suscripciones.svg'

const diccionarioGastos={
  ahorro: IconoAhorro,
  casa: IconoCasa,
  comida: IconoComida,
  gastos: IconoGastos,
  ocio: IconoOcio,
  salud: IconoSalud,
  subscripciones: IconoSubscripciones
}

const Gasto = ({gasto, setGastoEditar, eliminarGasto}) => {

  const {nombreGasto, cantidad, categoria, fecha} = gasto

  return (
    <div className="flex justify-around">
      

      <img src={diccionarioGastos[categoria]} alt="" className="icono"/>
        <div className="mb-6">
            <label className="text-gray-600 font-bold text-xl">Nombre Gasto</label>
            <p className="text-gray-600 font-bold mt-3 text-center">{nombreGasto}</p>
        </div>
        <div>
            <label className="text-gray-600 font-bold text-xl">Cantidad</label>
            <p className="text-gray-600 font-bold mt-3 text-center">${cantidad}</p>
        </div>
        <div>
            <label className="text-gray-600 font-bold text-xl">Categoría</label>
            <p className="text-gray-600 font-bold mt-3 text-center">{categoria}</p>
            
        </div>
        <div>
          <label className="text-gray-600 font-bold text-xl">Fecha</label>
          <p className="text-gray-600 font-bold mt-3 text-center">{formatearFecha(fecha)}</p>
        </div>
        <div>
          <button className="p-2 bg-yellow-400 font-bold uppercase rounded-xl mr-2 mt-8"
          onClick={()=> setGastoEditar(gasto)}>Editar</button>
          <button className="p-2 bg-red-400 font-bold uppercase rounded-xl mt-2"
          onClick={()=>eliminarGasto(gasto.id)}>Eliminar</button>
        </div>
      </div>
    
  )
}

export default Gasto
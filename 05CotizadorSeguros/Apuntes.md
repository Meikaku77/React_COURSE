# Context

- Creo la carpeta /constants/index.js y coloco el arreglo de MARCAS

~~~js
export const MARCAS=[
    {id: 1, nombre: 'Europeo'},
    {id: 2, nombre: 'Americano'},
    {id: 3, nombre: 'Asiatico'}
]
~~~

- Lo importo en Formulario.jsx
- Itero con un .map y creo las opciones
- Ahora debo crear un listado de los últimos 20 años
- Genero la variable en constants/index.js
- Array.from convierte a arreglo

~~~js
const YEARMAX = new Date().getFullYear()

export const YEARS = Array.from( new Array(20), (valor, index)=> YEARMAX - index)
~~~

- importo YEARS al formulario
- Itero con un .map YEARS para agregar los años al select de opciones
- Creo dos planes en constants.index
- Importo un Fragment para iterar los planes
- Coloco un label y un input tipo radio. Tienen que tener el mismo name, lo que cambia es el value
- Si pusiera el name diferente podría elegir ambas opciones 

~~~js
             <div>

                <label className="block mb-3 font-bold text-gray-700 uppercase">
                    PLANES
                </label>
                <div className="flex gap-3 items-center">
                    {PLANES.map(plan=>(
                        <Fragment key={plan.id}>
                            <label>{plan.nombre}</label>
                            <input type="radio" 
                            name="plan"
                            value={plan.id}/>
                        </Fragment>
                    ))}
                </div>
            </div>
~~~

- Creo el input de tipo submit
----

## CONTEXT

- Creo la carpeta src/context/CotizadorProvider.jsx
- Creo el context con createContext(), lo guardo en una variable

~~~js
import { createContext } from "react"


const CotizadorContext = createContext()

const CotizadorProvider = () => {
  return (
    <div>CotizadorProvider</div>
  )
}

export default CotizadorProvider
~~~

- Creo el Provider, le paso el children. Este children van a ser todos los componentes que hay dentro del Provider
- Creo dos exports, el nombrado que va aser el Provider y un export default para el context
- Se requiere una prop llamada value que es un objeto dónde va todo aquello que quiero en el context

~~~js
import { createContext } from "react"


const CotizadorContext = createContext()

const CotizadorProvider = ({children}) => {
  return (
    
    <CotizadorContext.Provider value={{}}>
        {children}
    </CotizadorContext.Provider>
  )
}

export {
    CotizadorProvider
}

export default CotizadorContext
~~~

- Provider es quien provee los datos, lo importo en App.jsx y envuelvo la aplicación con el Provider

~~~js
function App() {
 

  return (
    <CotizadorProvider>
        
        <AppSeguro />

    </CotizadorProvider>
  )
}
~~~

----

## Pasar datos en el provider

- Necesito el hook useContext para extraer los valores que hay dentro del value del context con desestructuración
- Todos los componentes que estén dentro del Provider podrán acceder a esta info
- Se pueden incluir funciones en el value, states, etc

~~~js
 const {value} = useContext(CotizadorContext)
~~~

- Puedo tener múltiples context
- En lugar de pasar directamente un setState puedo guardarlo dentro de una función de flecha y pasarlo en el value del Provider
----

## Crear un hook para el context

~~~js
import {useContext} from 'react'
import CotizadorContext from '../context/CotizadorProvider'

const useCotizador = () => {
  return useContext(CotizadorContext)
}

export default useCotizador
~~~

- Ahora puedo usar el useCotizador para extraer los valores directamente sin hacer tantas importaciones
----
## Creando el state para el Formulario

- Creo handleChangeDatos en el Provider y lo paso por el value en el Context
- Lo extraigo en Formulario.jsx con useCotizador y lo incorporo a los selects con el onChange

~~~js
onChange={e=> handleChangeDatos(e)}
~~~

- Estoy metiendo todo el state en un objeto
- En cotizadorProvider creo el state y lo defino como un objeto con marca, year y plan 

~~~js
const [datos, setDatos] = useState({
    marca:"",
    year:"",
    plan:""
  })
~~~

- Meto el valor de la izquierda entre corchetes para que sea una expresión válida, y le paso el value
- Al manejar el state hay que tomar una copia de lo que haya antes con el operador spread
- De esta forma se maneja el state como un objeto

~~~js
  const handleChangeDatos=(e)=>{
      setDatos({
        ...datos,
        [e.target.name]: e.target.value
      })
  }
~~~

- Coloco el state en el Context para poder introuducirlo en el value de los selects
- en el input radio no hace falta porque es un input

~~~js
import { MARCAS, YEARS, PLANES } from "../constants"
import { Fragment } from "react"
import useCotizador from "../hooks/useCotizador"

const Formulario = () => {

    const {handleChangeDatos, datos} = useCotizador()

  return (
    <>

        <form className="my-5">
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
~~~
----

## Validación 

- El evento del submit solo se requiere en Formulario
- Uso el Object.values para comprobar los valores. Si usara Object.keys comprobaría las propiedades y ya tiene marca, year y plan ( con un string vacío)
- El error si lo voy a definir en un state global (context). Lo inicio como un string vacío 
- Le coloco un return para que no continue ejecutando el código
- Seteo el error a string vacío para que cuando le pase todos los datos desaparezca la alerta

~~~js
    const handleSubmit=(e)=>{
        e.preventDefault()
        if(Object.values(datos).includes('')){
            setError('Error: campos obligatorios')
            return
        }

        setError('')
    }
~~~

- Ahora puedo renderizar el componente de error condicionalmente en el Formulario

~~~js
{error && <Error />}
~~~

- Puedo extraer el error del context en el componente en lugar de pasarlo como prop
- Error.jsx

~~~js
import useCotizador from "../hooks/useCotizador"

const Error = () => {
  
    const {error} = useCotizador()
  
    return (
    <div className="font-bold text-center text-xl bg-red-900 text-white p-3 uppercase rounded">{error}</div>
  )
}

export default Error
~~~
----

# Creando la función de cotizar

- Creo la función cotizar en el context
- Es un ejercicio de algoritmia
  - Hay 3 marcas: Europeo es el más caro, americano el intermedio, el asiático es el barato
  - El coste del seguro varía según el año
  - el plan básico es más barato que el completo
- Entonces tenemos
  - Una base
  - Obtener diferencia de años
  - Hay que erstar el 3% por cada año
  - el Americano incrementa el costo 15%, el europeo un 30%, el asiático un 5 %
  - El plan básico incrementa el 20% y el completo el 50%
- Me voy a ayudar de algunos helpers
- Creo src/helpers/index.js
- La base serán 2000

~~~js
export const obtenerDiferenciaYear = (year)=>{
    return new Date().getFullYear - year
}
~~~

~~~js
const cotizarSeguro=()=>{
    let resultado = 2000

  const diferenciaYears=  obtenerDiferenciaYear(datos.year)

  }
~~~

- Por cada año de diferencia el resultado baja un 3 %
- Debo multiplicar la diferencia de años con el 3, y el resultado multiplicarlo por la base (2000) y dividrlo todo por 100

~~~js

  const [error, setError] = useState('')


  const cotizarSeguro=()=>{
    let resultado = 2000

  const diferenciaYears=  obtenerDiferenciaYear(datos.year)

  resultado -= ((diferenciaYears * 3) * resultado) / 100 

  }
~~~

- Para el incremento sobre el precio según la marca creo otro helper
- Las marcas tienen un id en número. Cuando se colocan en HTML se transforman en strings 

~~~js
export function calcularMarca(marca){
        let incremento

        switch(marca){
            case "1":
                incremento = 1.30
            break;

            case "2":
                incremento = 1.15
            break;

            case "3":
                incremento = 1.05
            break;
            default:
            break;
        }
            return incremento
}
~~~

- La importo en el Provider y la agrego a la función

~~~js

  const cotizarSeguro=()=>{
    let resultado = 2000

  const diferenciaYears=  obtenerDiferenciaYear(datos.year)

  resultado -= ((diferenciaYears * 3) * resultado) / 100 

    resultado *=  calcularMarca(datos.marca)

  }
~~~

- Si es básico le añade el 20% y si es completo el 50%

~~~js

export function calcularPlan(plan){

    return (plan=== "1") ? 1.20: 1.50

}
~~~

- En el Provider:
- Le añado toFixed(2) para evitar todos los número que vienen decimales

~~~js
  const cotizarSeguro=()=>{
    let resultado = 2000

  const diferenciaYears=  obtenerDiferenciaYear(datos.year)

  resultado -= ((diferenciaYears * 3) * resultado) / 100 

    resultado *=  calcularMarca(datos.marca)
   
    resultado *= calcularPlan(datos.plan)

    resultado.toFixed(2)

    console.log(resultado)

  }
~~~

- Puedo usar una función en el helpers para formatear a dinero
- helpers:

~~~js
export function formatearDinero(cantidad){

    return cantidad.toLocaleString('en-US',{
        style:'currency',
        currency:"USD"
    })

}
~~~

- En el Provider, formateo a dinero y coloco resultado en el state de setResultado ( iniciado con un useState en 0 )

~~~js
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
~~~

## Mostrar resultado

- Uso el hook para extraer el resultado en AppSeguro
- Uso un condicional para renderizar cuando no es 0
~~~js
import useCotizador from "../hooks/useCotizador"
import Formulario from "./Formulario"


const AppSeguro = () => {


  const {resultado} = useCotizador()

  return (
    <>
        <header className="my-10">
            <h1 className="font-bold text-4xl text-yellow-600 uppercase text-center">COTIZADOR DE SEGUROS DE AUTO</h1>
        </header>

        <main className="bg-gray-100 md:w-2/5 lg:w-2/4 mx-auto shadow-xl rounded-lg p-10">
            
            <Formulario />
        </main>

        <div className="text-4xl text-center font-bold font-serif mt-10">
          <p>{resultado != 0 ? resultado : '' }</p>

        </div>
    </>
  )
}

export default AppSeguro
~~~






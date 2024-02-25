# Criptos React

- Install

> npm i @emotion/react @emotion/styled

- Importar styled para crear Styled Components
- Uso la palabra styled seguida de un punto y el elemento HTML, luego back ticks y dentro el código CSS
- para tener autocompletado instalar la extensión vscode-styled-components

~~~js
import styled from '@emotion/styled'

const Heading = styled.h1`
  font-size: 5rem;
  color: white;
  `
~~~

## Creando custom Hook

- Útil para poder reutilizar una función  que incorpore el state (y todas las funciones de React) y mantener el valor de una función de manera persistente

- Empiezan por la palabra use

- Puede devolver un array, un objeto...

~~~js
import React from 'react'

const useSelectMonedas = () => {
    const selectMonedas =()=>{
        console.log("Desde selectMonedas")
    }

    return [selectMonedas]
}

export default useSelectMonedas
~~~

- Debo extraer el valor del return y llamarlo

~~~js
const [selectMonedas] = useSelectMonedas()

selectMonedas()
~~~

## Utilizando el hook

- Puedo usar el return implicito con paréntesis y mostrar un html

- Luego lo llamo como un pomponente después de extraerlo con desestructuración cómo he hecho aqui arriba

~~~js

import React from 'react'

const useSelectMonedas = () => {
   
    const selectMonedas =()=>(  //return implícito con paréntesis
        <label>Select Monedas</label>

    )
        
    

    return [selectMonedas]
}


export default useSelectMonedas
~~~

- Lo llamo como un componente

~~~js

const [SelectMonedas] = useSelectMonedas


<SelectMonedas />
~~~

- Le puedo pasar cómo primer parámetro el label

~~~js
const useSelectMonedas = (label) => {
   
    const selectMonedas =()=>(
        <label>{label}</label>

    )
        

    return [selectMonedas]
}
~~~

- Se lo pongo cómo parámetro al hook

~~~js
   const [SelectMonedas] = useSelectMonedas('Elige tu moneda')
~~~
- Le añado un parámetro más a useSelectMonedas

~~~js

    const [SelectMonedas] = useSelectMonedas('Elige tu moneda', monedas)

    const monedas = [
        {id: 'USD', nombre: 'Dolar de Estados Unidos'},
        {id: 'MXN', nombre: 'Peso Mexicano'},
        {id: 'EUR', nombre: 'Euro'},
        {id: 'GBP', nombre: 'Libra Esterlina'},
    ]
~~~

- Uso el map para mapear las opciones

~~~js
    const selectMonedas =()=>(
        <>
            <Label>{label}</Label>
            <select>
                <option>--Seleccione--</option>
                
                {opciones.map(opcion=>(
                    <option
                    key={opcion.id}
                    >{opcion.nombre}</option>
                ))}
            </select>
      
        
        </>

    )

~~~

- Añadiéndole un state al custom Hook
- Lo incorporo en el return

~~~js

const useSelectMonedas = (label, opciones) => {

    const [state, setState]= useState('')
   
    const selectMonedas =()=>(
        <>
            <Label>{label}</Label>
            <Select
                value={state}
                onChange={e=> e.target.value}
            >
                <option>--Seleccione--</option>

                {opciones.map(opcion=>(
                    <option
                    key={opcion.id}
                    value={opcion.id}  //importante!!
                    >{opcion.nombre}</option>
                ))}
            </Select>
      
        
        </>

    )
        

    return [state, selectMonedas]
}
~~~

- Al ser un arreglo, la desestructuración es posicional. Yo puedo llamarlo como me plazca

~~~js
const [moneda, SelectMonedas] = useSelectMonedas('Elige tu moneda', monedas)
~~~

- Usaré el tercer endpoint del TopList

~~~js
"https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD"
~~~

- Hago la promesa 
- Uso una arrow function dentro de useEffect para usar el async await
- La info que interesa está en Data

~~~js
    useEffect(()=>{

        const consultarAPI= async()=>{

            const url="https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD"
            const resp = await fetch(url)
            const resultado= await resp.json()

            console.log(resultado.Data)
        }

        consultarAPI()

    }, [])
~~~

## Formateando un Array para pasarlo como opciones

- La info está en CoinInfo. Me interesa el FullName y el Name que es el código de 3 dígitos

~~~js
    useEffect(()=>{

        const consultarAPI= async()=>{

            const url="https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD"
            const resp = await fetch(url)
            const resultado= await resp.json()

            const arrayCriptos = resultado.Data.map(cripto=>{
                const objeto={
                    id: cripto.CoinInfo.Name,
                    nombre: cripto.CoinInfo.FullName
                }
                
                return objeto
            })
        }

        consultarAPI()

    }, [])
~~~

- Necesito los states de criptomoneda y moneda en el padre.
- Creo el state en App.jsx de monedas, setMonedas y se lo paso como props a Formulario. Lo inicio como un objeto
- en el handleSubmit del Formulario:

~~~js
    const handleSubmit =(e)=>{
        e.preventDefault()

        if([moneda, criptomoneda].includes('')){
            setError(true)
            return
        }

        setError(false)
        setMonedas({
            moneda,
            criptomoneda
        })
        
    }
~~~

# Cotizar (segundo llamado API)

- Multiple Symbols full data
- En un lugar del string le paso la cripto y en otro la moneda de cambio

> https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD

- Uso un useeffect para que esté atento a los cambios en monedas
- Uso desestructuración para extraer el valor de monedas

~~~js

  useEffect(()=>{
    if(Object.keys(monedas).length > 0){

      const {moneda, criptomoneda} = monedas
      const cotizarCripto= async ()=>{
        const url=`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

        const resp= fetch(url)
        const resultado = await resp.json()

        
      }
      cotizarCripto()
    }

  },[monedas])
~~~

- Puedo ponerle un console.log a resultado para analizar la respuesta 
- Se usará DISPLAY. En el objeto está DISPLAY.CRIPTOMONEDA.MONEDA
- Uso los corchetes para que me acepte las variables
~~~js
 resultado.DISPLAY[criptomoneda][moneda]
~~~

- Lo añado al nuevo state de cotización con setCotizacion


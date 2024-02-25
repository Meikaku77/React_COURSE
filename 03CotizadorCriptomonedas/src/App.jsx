import styled from '@emotion/styled'
import ImagenCripto from './img/imagen-criptos.png'
import Formulario from './components/Formulario'
import {useState, useEffect} from 'react'
import Resultado from './components/Resultado'



const Heading = styled.h1`
  font-size: 5rem;
  color: white;
`
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  width: 90%;
`
const Imagen = styled.img`
  max-width: 400px;
  width: 80%;
  margin: 100px auto 0 auto;
  display: block;
`

function App() {

  const [monedas, setMonedas] = useState({})

  const [cotizacion, setCotizacion] = useState({})

  useEffect(()=>{
    if(Object.keys(monedas).length > 0){

      const {moneda, criptomoneda} = monedas
      const cotizarCripto= async ()=>{
        const url=`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

        const resp= await fetch(url)
        const resultado = await resp.json()

        setCotizacion(resultado.DISPLAY[criptomoneda][moneda])

        
      }
      cotizarCripto()
    }

  },[monedas])
 

  return (
    <Container>
      <Heading className="text-center font-bold">Cripto App</Heading>

      {
        cotizacion.PRICE && 
        (<Resultado cotizacion={cotizacion}/>) 
         
        
      }


      <Formulario  setMonedas={setMonedas} />
      {console.log(monedas)}

      




    </Container>
  )
}

export default App

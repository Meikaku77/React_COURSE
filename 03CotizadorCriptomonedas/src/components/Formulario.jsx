import {useEffect} from 'react'
import styled from '@emotion/styled'
import useSelectMonedas from '../hooks/useSelectMonedas'
import { monedas } from '../data/monedas'
import { useState } from 'react'
import Error from './Error'

const InputSubmit = styled.input`
    background-color: #9497FF;
    border: none;
    width: 100%;
    padding: 10px;
    color: #FFF;
    border-radius: 16px;
    font-size: 3rem;
    transition: background-color .3s ease;

    &:hover{
        background-color: #7A7DFE;
    }
`




const Formulario = ({setMonedas}) => {
    
    const [criptos, setCriptos] = useState([])
    const [error, setError] = useState(false)

    const [moneda, SelectMonedas] = useSelectMonedas('Elige tu moneda', monedas)
    const [criptomoneda , SelectCripto] = useSelectMonedas('Elige tu criptomoneda', criptos)


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

            setCriptos(arrayCriptos)
        }

        consultarAPI()

    }, [])

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



    return (
    
        <form onSubmit={handleSubmit}>
            {error && <Error />}

            <SelectMonedas/>

            <SelectCripto />
            


            <InputSubmit type="submit"  value="cotizar"/>
        </form>

    
  )
}

export default Formulario
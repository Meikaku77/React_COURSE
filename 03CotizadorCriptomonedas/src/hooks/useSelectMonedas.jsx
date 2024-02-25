import {useState} from 'react'
import styled from '@emotion/styled'

const Label = styled.label`
    color: white;
    display: block;
    font-size: 4rem;
`

const Select = styled.select`
    width: 100%;
    padding: 12px;
    border-radius: 16px;
    text-align: center;
    margin-bottom: 20px;
`

const useSelectMonedas = (label, opciones) => {

    const [state, setState]= useState('')
   
    const selectMonedas =()=>(
        <>
            <Label className="text-center">{label}</Label>
            <Select
                value={state}
                onChange={(e)=> setState(e.target.value)}
            >
                <option>--Seleccione--</option>

                {opciones.map(opcion=>(
                    <option
                    key={opcion.id}
                    value={opcion.id} //importante!!
                    >{opcion.nombre}</option>
                ))}
            </Select>
      
        
        </>

    )
        

    return [state, selectMonedas]
}

export default useSelectMonedas
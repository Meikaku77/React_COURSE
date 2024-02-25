import {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPokemons } from './store/slices/pokemon/thunks'

const PokemonApp = () => {

    const dispatch = useDispatch()
    const {pokemons, page} = useSelector((state)=> state.pokemons)

    console.log(pokemons)

    useEffect(()=>{
        dispatch(getPokemons())

    }, [])




  return (
    <>
        <div className="font-black text-6xl text-red-700 mb-10">Pokemon</div>
        <hr/>
        <ul className="mt-10">
       {pokemons.map(pokemon=>(
        <li key={pokemon.name}
            className="font-black m-3 uppercase"
        >{pokemon.name}</li>
       ))}
        </ul>

        <button className="rounded p-3 bg-red-600 text-white text-xl uppercase mt-10"
            onClick={()=>dispatch(getPokemons(page))}
        >NEXT</button>
    
    </>

  )
}

export default PokemonApp
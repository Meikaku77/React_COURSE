import axios from "axios"
import { setPokemons, startLoadingPokemons } from "./pokemonSlice"


export const getPokemons=(page= 0)=>{

    const url = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${page * 10}` //10 pokemons


    return async (dispatch, getState)=>{
        dispatch(startLoadingPokemons())

        const {data} = await axios(url)

        dispatch(setPokemons({pokemons: data.results, page: page + 1}))

    
    }
}
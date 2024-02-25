import {configureStore} from '@reduxjs/toolkit'
import counterReducer from '../store/slices/counter/counterSlice'
import pokemonReducer from '../store/slices/pokemon/pokemonSlice'
import { todosApi } from './apis/todosApi'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        pokemons: pokemonReducer,
        [todosApi.reducerPath]: todosApi.reducer,

    },
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(todosApi.middleware)
})
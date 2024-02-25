import { useState } from "react"
import {useSelector, useDispatch} from 'react-redux'
import PokemonApp from "./PokemonApp"
import { decrement, increment, reset } from "./store/slices/counter/counterSlice"
import TodoApp from "./TodoApp"

function App() {
 
  const {value} = useSelector((state)=>state.counter)

  const dispatch = useDispatch()

  return (
    <>
    <h1 className="text-center text-3xl font-black text-blue-600 mt-3">COUNTER</h1>
      <main>
        <div className="flex justify-center mt-10 mb-10 gap-3">
          <button className="border border-blue-500 rounded-xl p-3 font-black text-blue-600"
          onClick={()=>dispatch(increment())}          
          >+ 1</button>

          <button className="border border-blue-500 rounded-xl p-3 font-black text-blue-600"
          onClick={()=>dispatch(decrement())}
          >- 1</button>

          <button className="border border-blue-500 rounded-xl p-3 font-black text-blue-600"
          onClick={()=>dispatch(reset())}
          >RESET</button>

        </div>

        <p className="text-center text-4xl font-sans">{value}</p>

      </main>
      <div className="text-center mt-20">
        <PokemonApp />
      </div>
      <div className="m-10">
        <TodoApp />
      </div>
    
    </>
  )
}

export default App

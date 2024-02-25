import {useGetTodosQuery, useGetTodoQuery} from './store/apis/todosApi'
import { useState } from 'react'

const TodoApp = () => {

    const [todoId, setTodoId] = useState(1)

   const {data: todos = [], isLoading} = useGetTodosQuery()
    const {data: todo} = useGetTodoQuery(todoId)


    const nextTodo = () =>{
        setTodoId(todoId + 1)
    }


  return (
    <>
        <h1 className="text-6xl text-center text-yellow-700 font-mono font-black">Todos -RTK Query</h1>
        <hr/>
        <h4 className="text-xl font-bold text-center">{isLoading ? "isLoading...": ""}</h4>

        <pre className="font-bold text-xl text-center m-6">{JSON.stringify(todo)}</pre>

        <div className="flex justify-center">
            <ul className="flex flex-col justify-center">
                {todos.map(todo=>(

                    <li key={todo.id}
                    > <strong className="mx-3">{todo.completed ? "DONE": "PENDING"}</strong> {todo.title}</li>
                ))}
                </ul>*

        </div>

        <div className="text-center mt-3">
            <button className="border p-2 rounded border-yellow-600 text-yellow-700 hover:text-yellow-900" onClick={nextTodo}>NEXT TODO</button>

        </div>
    </>
  )
}

export default TodoApp
import { useRouteError } from "react-router-dom"

const ErrorPage = () => {
  
  const error= useRouteError()
  
    return (
    <div>
        <h1 className="text-blue-700 text-center font-bold font-serif text-4xl">CRM - Clientes</h1>
        <p className="text-center">Hubo un error</p>
        <p className="text-center">{error.statusText || error.message}</p>
    </div>
  )
}

export default ErrorPage
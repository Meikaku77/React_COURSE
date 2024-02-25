import useCotizador from "../hooks/useCotizador"
import Formulario from "./Formulario"


const AppSeguro = () => {


  const {resultado} = useCotizador()

  return (
    <>
        <header className="my-10">
            <h1 className="font-bold text-4xl text-yellow-600 uppercase text-center">COTIZADOR DE SEGUROS DE AUTO</h1>
        </header>

        <main className="bg-gray-100 md:w-2/5 lg:w-2/4 mx-auto shadow-xl rounded-lg p-10">
            
            <Formulario />
        </main>

        <div className="text-4xl text-center font-bold font-serif mt-10">
          <p>{resultado != 0 ? resultado : '' }</p>

        </div>
    </>
  )
}

export default AppSeguro
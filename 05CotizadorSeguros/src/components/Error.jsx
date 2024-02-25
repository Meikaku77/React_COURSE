import useCotizador from "../hooks/useCotizador"

const Error = () => {
  
    const {error} = useCotizador()
  
    return (
    <div className="font-bold text-center text-xl bg-red-900 text-white p-3 uppercase rounded">{error}</div>
  )
}

export default Error
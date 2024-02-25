
const Resultado = ({cotizacion}) => {
const {PRICE, VOLUMEDAY, IMAGEURL }= cotizacion

  return (
    <div className="text-white text-xl text-center ">
        <p>{PRICE}</p>
        <p>{VOLUMEDAY}</p>
        <div className="flex justify-center">
          <img src={`https://cryptocompare.com/${IMAGEURL}`} alt="imagen cripto" />

        </div>

    </div>
  )
}

export default Resultado
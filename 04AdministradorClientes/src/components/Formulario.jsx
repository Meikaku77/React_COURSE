import React from 'react'

const Formulario = ({cliente}) => {
  return (
    <>
      <div className="mb-4 mt-10">
        <label htmlFor='nombre' className="font-bold font-serif text-xl ml-4">Nombre: </label>
        <input type="text"
              placeholder="Introduce el nombre" 
              className="p-3 ml-4 text-center"
              id="nombre"
              name="nombre"
              defaultValue={cliente?.nombre}/>
      </div>
      <div className="mb-4">
        <label htmlFor='empresa' className="font-bold font-serif text-xl ml-4">Empresa: </label>
        <input type="text"
              placeholder="Introduce la empresa" 
              className="p-3 ml-3 text-center"
              id="empresa"
              name="empresa"
              defaultValue={cliente?.empresa}/>
      </div>
      <div className="mb-4">
        <label htmlFor='email' className="font-bold font-serif text-xl ml-4">Email: </label>
        <input type="email"
              placeholder="Introduce el email" 
              className="p-3 ml-11 text-center"
              id="email"
              name="email"
              defaultValue={cliente?.email}/>
      </div>
      <div className="mb-4">
        <label htmlFor='telefono' className="font-bold font-serif text-xl ml-4">Teléfono: </label>
        <input type="number"
              placeholder="Introduce el teléfono" 
              className="p-3 ml-4 text-center"
              id="telefono"
              name="telefono"
              defaultValue={cliente?.telefono}/>
      </div>
    </>

    
  )
}

export default Formulario
import React from 'react'
import Paciente from './Paciente'

const ListadoPacientes = ({pacientes, setPaciente, eliminarPaciente}) => {


  
  return (
    <div className="md:w-2/2 lg:w-4/5 md:h-screen overflow-y-scroll">
      {pacientes && pacientes.length ? (

        <>
        <h2 className="font-black text-3xl text-center">Listado Pacientes</h2>
        <p className="text-xl text-center mt-5 mb-10" >
    
          Administra tus {" "}
          <span className="font-bold text-indigo-600">Pacientes y Citas</span>
        </p>
    
        {pacientes.map((paciente)=>(
          <Paciente 
          key={paciente.id}
          paciente={paciente}
          setPaciente={setPaciente}
          eliminarPaciente={eliminarPaciente}/>
        ))}
        
        </>
      ) : (
          <>
          <h2 className="font-black text-3xl text-center">No hay Pacientes</h2>
        <p className="text-xl text-center mt-5 mb-10" >
    
          Comienza a agregar{" "}
          <span className="font-bold text-indigo-600">tus Pacientes y Citas</span>
        </p>
          </>

      )}
        </div>
    
      

    
  )
}

export default ListadoPacientes
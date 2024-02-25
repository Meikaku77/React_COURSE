import Header from "./components/Header"
import Formulario from "./components/Formulario"
import ListadoPacientes from './components/ListadoPacientes'
import { useState, useEffect } from "react"

function App() {
 
const [pacientes, setPacientes]= useState([])

const [paciente, setPaciente] = useState({})

useEffect(()=>{
  const obtenerLS= ()=>{
    const pacientesLS= JSON.parse(localStorage.getItem('pacientes')) ?? [] //Si elimino pacientes del LS aparece un null.
                                                                      //Entonces si no hay nada en el LS, agregale un arreglo
   setPacientes(pacientesLS)                                           //JSON.parse convierte el string en un arreglo(objeto)
  }

  obtenerLS()
}, [])

useEffect(()=>{
  localStorage.setItem('pacientes', JSON.stringify(pacientes))

},[pacientes])

const eliminarPaciente = (id)=>{
  const pacientesActualizados = pacientes.filter( paciente => paciente.id !== id)

  setPacientes(pacientesActualizados)
}

  return (
    <div className="container mx-4 mt-20">
      <Header />

      <div className="mt-12 md:flex">
        <Formulario
          pacientes={pacientes}
          setPacientes={setPacientes}
          paciente={paciente}
          setPaciente={setPaciente}
          />
        <ListadoPacientes 
        pacientes={pacientes}
        setPaciente={setPaciente}
        eliminarPaciente={eliminarPaciente}/>

      </div>

    </div>
  )
}

export default App

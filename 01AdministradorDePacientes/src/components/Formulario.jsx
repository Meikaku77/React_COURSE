
import {useState, useEffect} from 'react'
import Error from './Error'



const Formulario = ({pacientes, setPacientes, paciente, setPaciente}) => {

  const [nombre, setNombre] = useState('')
  const [propietario, setPropietario] = useState('')
  const [email, setEmail] = useState('')
  const [alta, setAlta] = useState('')
  const [sintomas, setSintomas] = useState('')

  const [error, setError]= useState(false)

  useEffect(()=>{
    if(Object.keys(paciente).length >0){
      setNombre(paciente.nombre)
      setPropietario(paciente.propietario)
      setEmail(paciente.email)
      setAlta(paciente.alta)
      setSintomas(paciente.sintomas)
    }
  },[paciente])

  const generarId= Date.now()+Math.random().toString(36).substring(2)

const handleSubmit = (e)=>{
  e.preventDefault()
   
  //validación del formulario
  if([nombre, propietario, email, alta, sintomas].includes("")){
    setError(true)
    return
  }
    setError(false)

    const objPaciente = {
      nombre,
      propietario,
      email, 
      alta, 
      sintomas  
    } 

    if(paciente.id){ //Si tiene un id es que estoy editando
      objPaciente.id = paciente.id //el paciente actualizado
      const pacienteActualizado = pacientes.map(pacienteState=>pacienteState.id === paciente.id ? objPaciente: pacienteState)
        //objPaciente es el valor actualizado, itero sobre los valores y si no lo actualizo devuelvo el valor antiguo de pacienteState
      setPacientes(pacienteActualizado)
      setPaciente({}) //limpio paciente de la memoria
      
    }else{ //si no tiene id es que es un nuevo paciente, se lo genero
      objPaciente.id= generarId
      setPacientes([...pacientes, objPaciente]) //me traigo lo que haya en pacientes para no sobreescribirlo
    }

    setNombre('')
    setPropietario('')
    setAlta('')
    setEmail('')
    setSintomas('')
}


  
  return (
    <div className="md:w-1/2 lg:w-3/5">
    <h2 className="font-black text-3xl text-center">Seguimiento Pacientes</h2>
    <p className="text-center text-xl mt-5 mb-10">Añade Pacientes y {" "}
      <span className="text-indigo-600 font-bold text-lg"> Adminístralos</span>
    </p>
    <form onSubmit={handleSubmit} className="bg-white shadow-md mt-5 rounded-lg py-10 px-5 mb-10">
      {error && <Error><p>Todos los campos son obligatorios</p></Error>}
      <div>
        <label htmlFor="mascota" className="block text-gray-700 uppercase font-bold text-center"> Nombre Mascota </label>
        <input 
        id="mascota"
        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-xl placeholder:text-center"
        type="text"
        placeholder="Nombre de la mascota"
        value={nombre}
        onChange={(e)=>setNombre(e.target.value)} />
      </div>
      <div className="mt-5">
        <label htmlFor="propietario" className="block text-gray-700 uppercase font-bold text-center"> Nombre Propietario </label>
        <input 
        id="propietario"
        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-xl placeholder:text-center"
        type="text"
        placeholder="Nombre del propietario" 
        value={propietario}
        onChange={(e)=>setPropietario(e.target.value)}/>
      </div>
      <div className="mt-5">
        <label htmlFor="email" className="block text-gray-700 uppercase font-bold text-center"> Email </label>
        <input 
        id="email"
        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-xl placeholder:text-center"
        type="email"
        placeholder="Escribe tu email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)} />
      </div>
      <div className="mt-5">
        <label htmlFor="alta" className="block text-gray-700 uppercase font-bold text-center"> Alta </label>
        <input 
        id="alta"
        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-xl placeholder:text-center"
        type="date"
        placeholder="Fecha de alta" 
        value={alta}
        onChange={(e)=>setAlta(e.target.value)}/>
      </div>
      <div className="mt-5">
        <label htmlFor="sintomas" className="block text-gray-700 uppercase font-bold text-center"> Sintomas </label>
        <textarea
        id="alta"
        className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-xl placeholder:text-center"
        placeholder="Describe los síntomas" 
        value={sintomas}
        onChange={(e)=>setSintomas(e.target.value)}/>
      </div>

      <input type="submit" 
        className="bg-indigo-600 w-full mt-5 rounded-lg mx-auto text-white font-bold p-3 uppercase hover:bg-indigo-700 cursor-pointer transition-all"
        value={paciente.id ? "Editar Paciente": "Agregar Paciente"}/>
     
    </form>

  </div>
  )
}

export default Formulario
# Hooks
- Los hooks deben ir siempre antes del return dentro del componente, inmediatamente después de declararse el componente. Si hay funciones, antes de las funciones
- Un hook no debe ir dentro de un condicional ni despuñes de un return
----
# Pasando información entre componentes con props
- Le paso el state y el setState por props, las desestructuro en el componente hijo
- Cuando llamo al setState uso el spread operator para traerme lo que sea que haya en pacientes y le añado el nuevo objeto con setPacientes
- De esta manera se van agregando al arreglo. Están en memoria, si recargo se van a perder
----

# Componente Error

- Error.jsx

~~~jsx
const Error = ({mensaje}) => {
  return (
    <div className="bg-red-800 text-white font-bold text-center text-xl rounded-xl mb-5 p-2"> 
        <p>{mensaje}</p>
    </div>
  )
}
~~~
- Le paso el mensaje por las props

~~~jsx
<Error mensaje="Todos los campos son obligatorios"  />
~~~


----
# prop children

- children es una palabra reservada en React y hace referencia a todo lo que le pases a un componente
- en lugar de usar las props uso el componente con etiqueta de apertura y cierre y todo lo que haya dentro es el children

~~~jsx
<Error>Todos los campos son obligatorios</Error>
~~~

- Error.jsx
~~~jsx
const Error = ({children}) => {
  return (
    <div className="bg-red-800 text-white font-bold text-center text-xl rounded-xl mb-5 p-2"> 
        <p>{children}</p>
    </div>
  )
}
~~~
- Puedo pasarle html al children
~~~jsx
{error && <Error><p>Todos los campos son obligatorios</p></Error>}
~~~
----

# Iternado sobre un array

- En el map siempre hay un return. Entre paréntesis se dá por implicito
- Hago un .map de pacientes, creo la variable temporal paciente y dentro del map coloco el componente Paciente con la prop paciente
- Luego en paciente le paso la info
~~~jsx
  {pacientes.map((paciente)=>(
      <Paciente 
      key={paciente.email}
      paciente={paciente}/>
    ))}
~~~

~~~jsx
const Paciente = ({paciente}) => {
  return (
    <div className="bg-white m-3 shadow-md px-5 py-10 rounded-xl">
      <p className="font-bold mb-3 text-gray-700 uppercase">Nombre: {" "}
        <span className="font-normal normal-case">{paciente.nombre}</span>
      </p>
      <p className="font-bold mb-3 text-gray-700 uppercase">Propietario: {" "}
        <span className="font-normal normal-case">{paciente.propietario}</span>
      </p>
      <p className="font-bold mb-3 text-gray-700 uppercase">Email: {" "}
        <span className="font-normal normal-case">{paciente.email}</span>
      </p>
      <p className="font-bold mb-3 text-gray-700 uppercase">Fecha Alta: {" "}
        <span className="font-normal normal-case">{paciente.alta}</span>
      </p>
      <p className="font-bold mb-3 text-gray-700 uppercase">Sintomas: {" "}
        <span className="font-normal normal-case">{paciente.sintomas}</span>
      </p>

    </div> 
  )
}

export default Paciente
~~~

- Puedo usar la desestructuración para no escribir paciente.algo

~~~jsx
const {nombre, propietario, email, alta, sintomas} = paciente
~~~

## Generar ID único

~~~jsx
const generarId= Date.now()+Math.random().toString(36).substring(2)

    const objPaciente = {
      nombre,
      propietario,
      email, 
      alta, 
      sintomas,
      id: generarId
    }
~~~
----
## Porqué se usa un callback en el onClick

~~~js
   <button type="button" 
        className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 font-bold text-white uppercase rounded-lg"
        onClick={()=>setPaciente(paciente)}>Editar</button>
~~~

- Se usa un callback porque tiene un parámetro.
- Si no tuviera la arrow function dispararía automáticamente la función, ya que es una invocación
- Si no tiene parámetro se puede poner solo el nombre y ya se disparará con la acción

-----

## Lógica de llenar el formulario y editar paciente

~~~js
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
      objPaciente.id= generarId()
      setPacientes([...pacientes, objPaciente]) //me traigo lo que haya en pacientes para no sobreescribirlo
    }

    setNombre('')
    setPropietario('')
    setAlta('')
    setEmail('')
    setSintomas('')
}
~~~

- En formulario:

~~~js
useEffect(()=>{
    if(Object.keys(paciente).length >0){ //compruebo que paciente tenga algo, si tiene algo es que estoy editando
      setNombre(paciente.nombre)
      setPropietario(paciente.propietario)
      setEmail(paciente.email)
      setAlta(paciente.alta)
      setSintomas(paciente.sintomas)
    }
  },[paciente])
~~~

----
## LocalStorage

- En el local storage no se pueden guardar arreglos, solo Strings

~~~js
useEffect(()=>{
  localStorage.setItem('pacientes', JSON.stringify(pacientes))

},[pacientes])
~~~

- La primera vez pacientes es un arreglo vacío, esto hace que pierda los cambios que tenía almacenados anteriormente.
-  Por ello hay que escribir un código (otro useEffect) que revise si hay algo en storage y entonces lo coloque en el state
- Si no hay nada, que inicie lo que hay en el state
- Los effects se ejecutan en el orden que los coloques

~~~js
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
~~~


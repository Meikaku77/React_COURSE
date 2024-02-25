# Routing

> import { createBrowserRouter, RouterProvider } from 'react-router-dom'

- main.jsx
- Se podría hacer el router en una carpeta aparte e importarlo
- En él se irán definiendo las rutas

~~~js
const router = createBrowserRouter([
  {path:'/',
   element:<h1>Inicio</h1>},
   {path:'/nosotros',
   element: <h1>Nosotros</h1>}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider  router={router}/>
    
  </React.StrictMode>
)
~~~

# Outlet

- src/components/layout
- El outlet va a actuar como un contenedor dinámico
- Lo que está fuera del outlet se renderiza en todos los componentes

~~~jsx
import { Outlet } from "react-router"

const Layout = () => {
  return (
    <div>
        <h1 className="text-6xl  font-bold">CRM - REACT</h1>

        <Outlet />
    </div>
  )
}

export default Layout
~~~

- El contenido lo inyecto en el children. Todo lo que vaya en el arreglo de children contendrá el Layout

~~~jsx
const router = createBrowserRouter([
  {path:'/',
   element: <Layout />,
   children:[
    { 
      path: '/nosotros',
      element: <h1>Desde Nosotros</h1>
    }
   ]}
])
~~~

- Le añado index true para definir que la página principal va a usar este layout
- también puedo definirle un elemento

~~~jsx
const router = createBrowserRouter([
  {path:'/',
   element: <Layout />,
   children:[
    {
      index: true
      element: <h1>Inicio</h1>
    },
    { 
      path: '/clientes/nuevo',
      element: <NuevoCliente />
    }
   ]}
])
~~~

-----

## Layout

- md:flex es un media-query
- w-1/4 , el div toma uno de cuatro de espacio
- h-screen toma todo el alto de la pantalla
- overflow-scroll es que todo lo que desborde en ese div tendrá scroll

~~~js
import { Outlet } from "react-router"

const Layout = () => {
  return (
    <div>
        <div className="md:flex md:min-h-screen">
          <aside className="md:w-1/4 bg-blue-600 px-5 py-10">
              <h1>CRM - Clientes</h1>

          </aside>

        <main className="md:w-3/4 py-10 md:h-screen overflow-scroll"> 
          <Outlet />

        </main>

        </div>

    </div>
  )
}

export default Layout
~~~

- Para colocar los links uso Link y to para el path
- Lo coloco en el aside

~~~js
 <Link to="/clientes/nuevo" className="text-2xl font-bold text-white font-serif block hover:text-blue-200">Nuevo Cliente</Link>
~~~

## useLocation de react-router-dom

- No toma ningún parámetro

~~~js
  const location = useLocation()

  console.log(location)
~~~

- Imprime un objeto con el pathname de la página dónde me encuentro
- Puedo usarlo para colorear el link de la página dónde me encuentro

~~~js
 <Link to="/" className={`${location.pathname === '/'? "text-blue-200" : "text-white"} text-2xl font-bold text-white font-serif hover:text-blue-200 cursor-pointer block py-4`}>Clientes</Link>

 <Link to="/clientes/nuevo" className={`${location.pathname === '/clientes/nuevo'? "text-blue-200": "text-white"} text-2xl font-bold text-white font-serif hover:text-blue-200 cursor-pointer`}>Nuevo Cliente</Link>
~~~

- NavLink detecta automaticamente la clase
- Toma un arrow function con el valor isActive

~~~js
     <NavLink
        className={({isActive})=>isActive? "text-blue-200 text-2xl font-bold font-serif hover:text-blue-200 cursor-pointer block py-4" 
          : "text-white text-2xl font-bold font-serif hover:text-blue-200 cursor-pointer block py-4"}
        to={"/clientes/nuevo"}
        >Nuevo Cliente</NavLink>
~~~

## Función loader

- Creo la función loader, es similar al useEffect
- Tiene que nombrarse loader en minúsculas y siempre tiene que retornar algo
- La exporto desde Index.jsx
- Cuando la importo en el main la renombro a clientesLoader
- La añado en el router, así Index ya conoce el loader

~~~js
const router = createBrowserRouter([
  {path:'/',
   element: <Layout />,
   children:[
    {
      index: true,
      element: <Index />,
      loader: clientesLoader
    },
    { 
      path: '/clientes/nuevo',
      element: <NuevoCliente />
    }
   ]}
])
~~~

- Uso un hook que se va a encargar de obtener lo que retorne en el loader que asocio al componente
- **useLoaderData**
- El console.log devuelve "desde loader"

~~~js
import {useLoaderData} from 'react-router-dom'


export function loader(){

  return "desde loader"
}

const Index = () => {

  const data = useLoaderData()

  console.log(data)

  return (
    <>
      <h1 className="font-black text-3xl text-blue-900 font-serif ml-4">Clientes</h1>
      <h3 className="font-bold text-xl font-serif ml-4">Administra tus clientes</h3>
    </>
  )
}

export default Index
~~~

- En el loader coloco el objeto de clientes

~~~js
export function loader(){

  const clientes = [
    {
        id: 1,
        nombre: 'Juan',
        telefono: 102013313,
        email: "juan@juan.com",
        empresa: 'Codigo Con Juan'
    },
    {
        id: 2,
        nombre: 'Karen',
        telefono: 138198313,
        email: "karen@juan.com",
        empresa: 'Codigo Con Juan'
    },
    {
        id: 3,
        nombre: 'Josue',
        telefono: 31983913,
        email: "josue@juan.com",
        empresa: 'Codigo Con Juan'
    },
    {
        id: 4,
        nombre: 'Miguel',
        telefono: 319381983,
        email: "miguel@juan.com",
        empresa: 'Codigo Con Juan'
    },
    {
        id: 5,
        nombre: 'Pedro',
        telefono: 1398198938,
        email: "pedro@juan.com",
        empresa: 'Codigo Con Juan'
    },
];

  return clientes
}
~~~

- tengo asociado el loader renombrado clientesLoader a Index.
- Ahora puedo acceder al listado de clientes desde el hook useLoaderData
- El loader se convierte en un state, no hace falta usar useState

    NOTA: el loader lo exporto, lo asocio en el árbol de rutas, recojo la info con el hook useLoaderData

- Renderizo los clientes usando un ternario, creando una tabla, e itero con un .map,
- Para crear la tabla uso table, dentro un table row, con las columnas como tablehead
- Para el cuerpo uso table body
~~~js
      {clientes.length ?(
        <table className="w-full bg-white shadow mt-5 table-auto">
          <thead className="bg-blue-800 text-white font-bold text-lg">
              <tr>
                <th className="p-2">Cliente</th>
                <th className="p-2">Contacto</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
              <tbody>
                {clientes.map(cliente=>(
                  <tr>
                    <td className="p-6 text-center">
                      {cliente.nombre}
                    </td>

                  </tr>
                ))}
              </tbody>
        </table>
      )
      : (
        <p className="text-center font-bold text-xl mt-10">No hay clientes aún</p>
      ) }
~~~

- Creo el componente Cliente.jsx y lo renderizo en el map pasándole por props cliente y añadiéndole el key
- En Cliente uso table row, dentro un tabledata y dentro párrafos. Tengo tres tabledata porque tengo tres columnas
- Cliente.jsx

~~~js
const Cliente = ({cliente}) => {

    const {nombre, empresa, email, telefono, id} = cliente

  return (
     <tr className="border-b">
        <td className='p-6 text-center space-y-2'>
            <p className="font-bold text-xl">{nombre}</p>
            <p>{empresa}</p>
        </td>

        <td className="p-6 text-center">
            <p className="text-gray-600">Email:  <span className="text-gray-800 font-bold uppercase">{email}</span></p>
            <p>Tlf: {telefono}</p>
        </td>

        <td className="text-center">
            <button
            type="button"
            className="font-bold uppercase bg-blue-700 hover:bg-blue-800 transition-all p-3 rounded text-white">
                Editar
            </button>
            <button
            type="button"
            className="font-bold uppercase bg-red-700 hover:bg-red-800 transition-all p-3 rounded text-white ml-4">
                Eliminar
            </button>

        </td>

     </tr>
  )
}

export default Cliente
~~~

## useNavigate

- creo un botón para volver desde NuevoCliente a clientes
- usaré useNavigate

~~~js
import {useNavigate} from 'react-router-dom'

const NuevoCliente = () => {

  const navigate= useNavigate()

  return (
    <form action="">
      <div className="flex justify-end">
      <button
        type="button"
        className="bg-blue-700 text-white font-serif font-bold mr-4 rounded p-3"
        onClick={()=>navigate('/')}>
          VOLVER
        </button>
        {...}
~~~

- Puedo usar el -1 navigate(-1) para ir a la página anterior
----
## Creando un action para el formulario

- Nota que el componente Formulario lo introduzco dentro de un form para usar el input "submit"
- El componente Formulario en origen esta dentro de un Fragment, sin el form 

- en NuevoCliente

~~~js
      <div>
          <form action="">
            <Formulario />
            <input type="submit" 
             className="mt-5 rounded bg-blue-700 p-3 uppercase text-white font-bold text-center ml-20 hover:bg-blue-800" value="Registrar Cliente"/>
          </form>
      </div>
~~~
- Importo Form de react-router-dom
- Cambio la etiqueta form por el componente Form
- Le defino el método, en este caso POST
- Creo la función action, toda en minúscula y la exporto
- Siempre tiene que retornar algo

~~~js
import {useNavigate, Form} from 'react-router-dom'
import Formulario from '../components/Formulario'


export function action(){
  console.log("Submit al formulario...")

  return {ok:true}
}


const NuevoCliente = () => {

  const navigate= useNavigate()

  return (
    <>
     <div className="flex justify-between">
        <h1 className="ml-4 font-bold text-4xl font-serif text-blue-700">Nuevo Cliente</h1>
      <button
        type="button"
        className="bg-blue-700 text-white font-serif font-bold mr-8 rounded p-3 hover:bg-blue-800"
        onClick={()=>navigate(-1)}>
          VOLVER
        </button>

      </div>
      <div>
          <Form
          method='post'
          >
            <Formulario />
            <input type="submit" 
             className="mt-5 rounded bg-blue-700 p-3 uppercase text-white font-bold text-center ml-20 hover:bg-blue-800" value="Registrar Cliente"/>
          </Form>
      </div>
    
    </>
  )
}

export default NuevoCliente
~~~

- Debo indicarle en el router que tengo esta funcion
- La importo en el main, la renombro a nuevoClienteAction 
- main.js

~~~js
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import NuevoCliente, {action as nuevoClienteAction} from './pages/NuevoCliente'
import Index, {loader as clientesLoader} from './pages/Index'

const router = createBrowserRouter([
  {path:'/',
   element: <Layout />,
   children:[
    {
      index: true,
      element: <Index />,
      loader: clientesLoader
    },
    { 
      path: '/clientes/nuevo',
      element: <NuevoCliente />,
      action: nuevoClienteAction

    }
   ]}
])
~~~

# Cuando quieres obtener datos utilizas un loader y cuando quieres procesar un formulario utilizas un action
----

## Leer la información ingresada a un formulario con formData

- El action siempre va a tener un request
- En este request ( si le haces un console.log) vas a encontrar formData
- Se le llama de forma asíncrona y como un método, porque está en el prototype

~~~js
export async function action({request}){

  const formData = await request.formData() 
  
  return {ok:true}
}
~~~

- Si hago el console.log no aparece la info, pero en el prototype de formData aparecen varios métodos
- get(le passas el valor que quieres obtener), append, delete, forEach, entries...etc
- La sintaxis sería algo así
    - Creo una instancia de formData
    - Le voy agregando los campos
    - Hago un fetch a una url

~~~js
export async function action({request}){

  const formData = await request.formData() 
 
 const datos = new formData()
 datos.append('nombre', 'Juan')

 fetch(url, {
  body: datos,
  method: 'post'
 })
 
  return {ok:true}
}
~~~

- Cada elemento del formulario tiene un atributo llamado name con el nombre del campo (nombre, telefono, etc)
- Cuando uso el método get debo poner para el valor de retorno el nombre que hay en el name

~~~js
console.log(formData.get('nombre'))
~~~

- Puedo aplicar el spread para obtener todos los campos

~~~js
console.log([...formData])
~~~

- Otra manera sería con fromEntries

~~~js
const datos= Object.fromEntries(formData)
~~~

----

## Validar en el action

~~~js
export async function action({request}){

  const formData = await request.formData() 

  const datos = Object.fromEntries(formData)

  const errores= []
  
  if(Object.values(datos).includes("")){
    errores.push('Todos los campos son obligatorios')

    console.log(errores)
  }
  
  
  return {ok:true}
}
~~~

- Cómo puedo pasar este arreglo deerrores al componente?
- Primero retornar los errores

~~~js
export async function action({request}){

  const formData = await request.formData() 

  const datos = Object.fromEntries(formData)

  const errores= []

  if(Object.values(datos).includes("")){
    errores.push('Todos los campos son obligatorios')
  }
  
  if(Object.keys(errores).length){
    return errores
  }
  
  return {ok:true}
}
~~~

- Pero cómo los obtengo?
- Si para el loader usé el hook useLoaderData, aquí hay otro hook llamado **useActionData**

~~~js
const NuevoCliente = () => {

  const navigate= useNavigate()

  const errores = useActionData()

  return (...)
~~~

- Ahora puedo usar errores en el componente

~~~js
   {errores?.length && errores.map(error=>(
          <p className="text-center bg-red-600 text-white text-xl font-bold md:w-1/4 ml-4 rounded">{error}</p>
        )) }
~~~

- También puedo crear un componente de error y pasarle el children

~~~js
import React from 'react'

const Error = ({children}) => {
  return (
    <div className="text-center bg-red-600 text-white text-xl font-bold md:w-1/4 ml-4 rounded">
        {children}</div>
  )
}

export default Error
~~~

- Lo renderizo con un map

~~~js
{errores?.length && errores.map((error, i)=> <Error key={i}>{error}</Error>)}
~~~
-----

# Cuando usar useLoaderData y useActionData

- useLoaderData cuando quierasobtener el resultado de un loader
- useActionLoader cuando quieras obtener el resultado de un action

- En NuevoCliente estoy evaluando todos los campos, pero también puedo evaluar uno en específico
- La mejor forma para evaluar un email es una expresión regular

>    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

- Tengo que negar la condición para que en caso de que no se cumpla ejecute

~~~js
if(!regex.test(email)){
    errores.push('El email no es válido')
  }
~~~

- Para deshabilitar la validación de HTML5 puedo usar noValidate como atributo en el form
- El action queda tal que así

~~~js
export async function action({request}){

  const formData = await request.formData() 

  const datos = Object.fromEntries(formData)

  const email = formData.get('email')

  const errores= []

  if(Object.values(datos).includes("")){
    errores.push('Todos los campos son obligatorios')
  }
  
  let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
  
  if(!regex.test(email)){
    errores.push('El email no es válido')
  }

  if(Object.keys(errores).length){
    return errores
  }

  return {ok:true}
}
~~~
----

# JSON-SERVER

- Creo un archivo en la raíz llamado db.json
- Le paso la info del loader en formato json

~~~json
{
     "clientes" : [  
        {
            "id": 1,
            "nombre": "Juan",
            "telefono": 102013313,
            "email": "juan@juan.com",
            "empresa": "Codigo Con Juan"
        },
        {
            "id": 2,
            "nombre": "Karen",
            "telefono": 138198313,
            "email": "karen@juan.com",
            "empresa": "Codigo Con Juan"
        },
        {
            "id": 3,
            "nombre": "Josue",
           "telefono": 31983913,
            "email": "josue@juan.com",
            "empresa": "Codigo Con Juan"
        },
        {
            "id": 4,
            "nombre": "Miguel",
            "telefono": 319381983,
            "email": "miguel@juan.com",
            "empresa": "Codigo Con Juan"
        },
        {
            "id": 5,
            "nombre": "Pedro",
            "telefono": 1398198938,
            "email": "pedro@juan.com",
            "empresa": "Codigo Con Juan"
        }
    ]
}
~~~

- Pongo el json-server en modo watch

> json-server --watch db.json --port 4000

- Podría usar un fetch en el loader para consumir clientes pero lo voy a crear en un archivo separado
- Creo /src/data/clientes.js
- Creo una función llamada obtenerClientes
- Voy a usar variables de entorno, para ello creo un archivo .env
- En Vite las variables de entorno empiezan por VITE__

~~~
VITE_API_URL = http://localhost:4000/clientes
~~~

- Para usar las variables en Vite se usa

> import.meta.env

~~~js
export async function obtenerClientes(){
    
    const respuesta = await fetch(import.meta.env.VITE_API_URL)
    const resultado = await respuesta.json()
    console.log(resultado)
}
~~~

- La llamo en el loader (recuerda que el loader siempre tiene que tener un return para que no de error)

~~~js
export function loader(){

  obtenerClientes()
  return {ok: true}
}
~~~

- Aparece en consola el arreglo de clientes
- En clientes.js le coloco un return al resultado
- en el loader lo extraigo yy lo retorno

~~~js
export function loader(){

  const clientes= obtenerClientes()
  return clientes
}
~~~

----

## CREAR UNA PANTALLA DE ERROR

- El error boundrie son componentes de React que carga los errores en cualquier lado del componente
- Puedo añadir errorElement al router con un componente para mostrarlo en caso de error

~~~js
const router = createBrowserRouter([
  {path:'/',
   element: <Layout />,
   children:[
    {
      index: true,
      element: <Index />,
      loader: clientesLoader,
      errorElement: <p>Hubo un error</p>
    },
    { 
      path: '/clientes/nuevo',
      element: <NuevoCliente />,
      action: nuevoClienteAction

    }
   ]}
])
~~~

- Para extraer el error en el componente uso el hook useRouteError

~~~js
import { useRouteError } from "react-router-dom"

const ErrorPage = () => {
  
  const error= useRouteError()
  
    return (
    <div>
        <h1 className="text-blue-700 text-center font-bold font-serif text-4xl">CRM - Clientes</h1>
        <p className="text-center">Hubo un error</p>
        <p className="text-center">{error.message}</p>
    </div>
  )
}

export default ErrorPage
~~~

## AGREGAR NUEVO CLIENTE

- En src/data/clientes.js creo una nueva función llamada agregarCliente y le paso como argumento una variable llamada datos
- La llamo en NuevoCliente y le paso los datos extraidos del formData
- Puedo poner un console.log en agregarCliente para comprobar que se pasan los datos correctamente
- Al no ser get, le especifico el método, parseo el body y le añado los headers
- Lo meto todo en un try y un catch

~~~js
export async function agregarCliente(datos){

    try {

        const respuesta = await fetch(import.meta.env.VITE_API_URL,{
            method: 'post',
            body: JSON.stringify(datos), //lo convierto a JSON
            headers: {
                'Content-Type': 'application/json'
            }
        })

        await respuesta.json()
        
    } catch (error) {
        console.log(error)
    }

}
~~~

- La llamo en el action después de todas las validaciones. Cómo puede tardar le coloco el await para bloquear el código

~~~js
await agregarCliente(datos)
~~~

- En el return del action voy a colocarle un redirect de react-router-dom para redireccionar al usuario a la página principal
- Navigate es buena opción cuando quieres redireccionar mediante un botón
- Para barras de navegación se usa Link y NavLink

~~~jsx
export async function action({request}){

  const formData = await request.formData() 

  const datos = Object.fromEntries(formData)

  const email = formData.get('email')

  const errores= []

  if(Object.values(datos).includes("")){
    errores.push('Todos los campos son obligatorios')
  }
  
  let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
  
  if(!regex.test(email)){
    errores.push('El email no es válido')
  }

  if(Object.keys(errores).length){
    return errores
  }

  await agregarCliente(datos)

  return redirect('/')
}
~~~

# Editar Cliente y useParams para recuperar

- Routing dinámico
- Creo una nueva ruta
- Le pongo el comodín de :ClienteId
- Como element le coloco un nuevo componente que llamaré src/pages/EditarCliente.jsx

~~~jsx

const router = createBrowserRouter([
  {path:'/',
   element: <Layout />,
   children:[
    {
      index: true,
      element: <Index />,
      loader: clientesLoader,
      errorElement: <ErrorPage />
    },
    { 
      path: '/clientes/nuevo',
      element: <NuevoCliente />,
      action: nuevoClienteAction

    },
    {
      path: 'clientes/:clienteId/editar',
      element: <EditarCliente />
    }
   ]}
])
~~~

- Voy a Cliente.jsx para manejar el botón de editar
- Para ello importo el useNavigate de react-router-dom y lo coloco en el onclick como body de una función de flecha
- Uso back ticks e inyecto el id

~~~js
import {useNavigate} from 'react-router-dom'

const Cliente = ({cliente}) => {

    const {nombre, empresa, email, telefono, id} = cliente

    const navigate= useNavigate()

  return (
     <tr className="border-b">
        <td className='p-6 text-center space-y-2'>
            <p className="font-bold text-xl">{nombre}</p>
            <p>{empresa}</p>
        </td>

        <td className="p-6 text-center">
            <p className="text-gray-600">Email:  <span className="text-gray-800 font-bold uppercase">{email}</span></p>
            <p>Tlf: {telefono}</p>
        </td>

        <td className="text-center">
            <button
            type="button"
            className="font-bold uppercase bg-blue-700 hover:bg-blue-800 transition-all p-3 rounded text-white"
            onClick={()=> navigate(`/clientes/${id}/editar`)}>
                Editar
            </button>
            <button
            type="button"
            className="font-bold uppercase bg-red-700 hover:bg-red-800 transition-all p-3 rounded text-white ml-4">
                Eliminar
            </button>

        </td>

     </tr>
  )
}

export default Cliente
~~~

- Necesito el id de la url. Cómo lo extraigo?
- Para ello defino un loader en EditarCliente.jsx. Puedo extraer del loader los params

~~~js
export async function loader({params}){

    console.log(params)
}
~~~

- Esto no funciona todavía, debo declarar el louder en el router. Lo renombro a editarClienteLoader

~~~js
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import NuevoCliente, {action as nuevoClienteAction} from './pages/NuevoCliente'
import Index, {loader as clientesLoader} from './pages/Index'
import ErrorPage from './components/ErrorPage'
import EditarCliente, {loader as editarClienteLoader} from './pages/EditarCliente'

const router = createBrowserRouter([
  {path:'/',
   element: <Layout />,
   children:[
    {
      index: true,
      element: <Index />,
      loader: clientesLoader,
      errorElement: <ErrorPage />
    },
    { 
      path: '/clientes/nuevo',
      element: <NuevoCliente />,
      action: nuevoClienteAction

    },
    {
      path: 'clientes/:clienteId/editar',
      element: <EditarCliente />,
      loader: editarClienteLoader
    }
   ]}
])
~~~

- Ahora ya retorna el valor de la url el console.log del loader
- Con este valor ya puedo obtener el cliente

## Verificando que el cliente exista y mostrando error

- json-server funciona como una REST API, con lo que la url localhost:4000/clientes/1 muestra el objeto con id 1
- Uso back ticks para inyectar el id en la url
~~~js
export async function obtenerCliente(id){

    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/${id}`)
    const resultado = await respuesta.json()

    return resultado
}
~~~

- Importo la función en el componente EditarCliente. Guardo el resultado en una variable

~~~js
import { obtenerCliente } from "../data/clientes"

export async function loader({params}){


    const cliente= await obtenerCliente(params.clienteId)

    console.log(cliente)

    return {ok:true}
}
~~~

- Puedo hacer las validaciones directamente en el loader
- El Response cómo valor inicial toma un body, lo dejo vacío

~~~js

export async function loader({params}){


    const cliente= await obtenerCliente(params.clienteId)

    if(Object.values(cliente).length == 0){
        throw new Response('', { //valor inicial toma un body, lo dejo vacío
            status: 404,
            statusText: "No hay resultados"
        })
    }

    return cliente
}
~~~

- Para definir una página de error debo ir al main.jsx en el route y añadirle un errorElement con el componente ErrorPage definido previamente
- Puedo decirle en el componente de ErrorPage que revise si hay error.statusText

~~~js
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
~~~

# Haciendo el formulario para editar y Autocompletar el formulario

- Copio el contenido de NuevoCliente
- Importo Form y Formulario, useNavigate para el botón de volver, borro la linea de { errores?...}
- Para obtener lo que el loader esté retornando uso useLoaderData, extraigo cliente
- Le paso cliente al formulario

~~~js
import { obtenerCliente } from "../data/clientes"
import { Form, useNavigate, useLoaderData } from "react-router-dom"
import Formulario from "../components/Formulario"


export async function loader({params}){


    const cliente= await obtenerCliente(params.clienteId)

    if(Object.values(cliente).length == 0){
        throw new Response('', { //valor inicial toma un body, lo dejo vacío
            status: 404,
            statusText: "No hay resultados"
        })
    }

    return cliente
}


const EditarCliente = () => {

    const navigate= useNavigate()
    const cliente= useLoaderData()

  return (
    <>
    <div className="flex justify-between">
       <h1 className="ml-4 font-bold text-4xl font-serif text-blue-700">Editar Cliente</h1>
     <button
       type="button"
       className="bg-blue-700 text-white font-serif font-bold mr-8 rounded p-3 hover:bg-blue-800"
       onClick={()=>navigate('/')}>
         VOLVER
       </button>

     </div>
     <div>
         <Form
          method='post'
          noValidate
         >
           <Formulario cliente ={cliente}/>
           <input type="submit" 
            className="mt-5 rounded bg-blue-700 p-3 uppercase text-white font-bold text-center ml-20 hover:bg-blue-800" value="Editar Cliente"/>
         </Form>
     </div>
   
   </>
  )
}

export default EditarCliente
~~~

- Si le coloco el value={cliente.nombre} me va a saltar un error diciendo que no hay un onChange
- Por ello puedo usar el atributo defaultValue
- Pero ahora si voy a NuevoCliente me da error porque cliente es undefined
- Por ello le añado un optional chainin

~~~js
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
~~~

- Le coloco un errorElement al route en el main.jsx en el caso de que hubiera un error

## Creando el action para EditarCliente

- Creo una función llamada action fuera del componente de EditarCliente
- Copio lo del action del NuevoCliente y lo pego
- Cambio agregarCliente por la función que todavía no he creado que se llamará actualizarCliente
- Le pasi el id que hay en el params, y los datos

~~~js

export async function action({request, params}){
    const formData = await request.formData() 

    const datos = Object.fromEntries(formData)
  
    const email = formData.get('email')
  
    const errores= []
  
    if(Object.values(datos).includes("")){
      errores.push('Todos los campos son obligatorios')
    }
    
    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    
    if(!regex.test(email)){
      errores.push('El email no es válido')
    }
  
    if(Object.keys(errores).length){
      return errores
    }
  
    await actualizarCliente(params.clienteId, datos)
  
    return redirect('/')
}
~~~

- Debo importar el action y renombrarlo en el el main.jsx para el route

~~~js
    {
      path: 'clientes/:clienteId/editar',
      element: <EditarCliente />,
      loader: editarClienteLoader,
      action: editarClienteAction,
      errorElement: <ErrorPage />
    }
~~~

- Para que no de error la sentencia de {errores?...} la manera de extraer errores es con el hook useActionData
- Importo el error from components y el redirect de react-router-dom

~~~js
import { actualizarCliente, obtenerCliente } from "../data/clientes"
import { Form, useNavigate, useLoaderData, useActionData, redirect } from "react-router-dom"
import Formulario from "../components/Formulario"
import Error from "../components/Error"


export async function loader({params}){


    const cliente= await obtenerCliente(params.clienteId)

    if(Object.values(cliente).length == 0){
        throw new Response('', { //valor inicial toma un body, lo dejo vacío
            status: 404,
            statusText: "No hay resultados"
        })
    }

    return cliente
}


export async function action({request, params}){
    const formData = await request.formData() 

    const datos = Object.fromEntries(formData)
  
    const email = formData.get('email')
  
    const errores= []
  
    if(Object.values(datos).includes("")){
      errores.push('Todos los campos son obligatorios')
    }
    
    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    
    if(!regex.test(email)){
      errores.push('El email no es válido')
    }
  
    if(Object.keys(errores).length){
      return errores
    }
  
    await actualizarCliente(params.clienteId,datos)
  
    return redirect('/')
}

const EditarCliente = () => {

    const navigate= useNavigate()
    const cliente= useLoaderData()
    const errores = useActionData()

  return (
    <>
    <div className="flex justify-between">
       <h1 className="ml-4 font-bold text-4xl font-serif text-blue-700">Editar Cliente</h1>
     <button
       type="button"
       className="bg-blue-700 text-white font-serif font-bold mr-8 rounded p-3 hover:bg-blue-800"
       onClick={()=>navigate('/')}>
         VOLVER
       </button>

     </div>
     <div>
     {errores?.length && errores.map((error, i)=> <Error key={i}>{error}</Error>)}
         <Form
          method='post'
          noValidate
         >
           <Formulario cliente ={cliente}/>
           <input type="submit" 
            className="mt-5 rounded bg-blue-700 p-3 uppercase text-white font-bold text-center ml-20 hover:bg-blue-800" value="Editar Cliente"/>
         </Form>
     </div>
   
   </>
  )
}

export default EditarCliente
~~~

- La función actualizarCliente va a ser muy parecida a agregarCliente. La copio y optimizo
- Inyecto el id en la url
- Cambio el método a put

~~~js
export async function actualizarCliente(id, datos){
    try {

        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/${id}`,{
            method: 'PUT',
            body: JSON.stringify(datos), //lo convierto a JSON
            headers: {
                'Content-Type': 'application/json'
            }
        })

        await respuesta.json()
        
    } catch (error) {
        console.log(error)
    }
}
~~~

## Eliminar Cliente

- Para poder enviarle la acción al button de eliminar en Cliente.jsx hay que envolverlo en un Form 
- Le cambio el type a submit
- Importo Form y redirect
- Creo mi propia accion. Usualmente lo va aenviar a la misma dirección en la que estoy pero yo puedo colocarle una dirección
- Uso back ticks con el comodín del id para poder extraerlo

~~~js
         <Form>

                <button
                type="submit"
                action={`clientes/${id}/eliminar`}
                className="font-bold uppercase bg-red-700 hover:bg-red-800 transition-all p-3 rounded text-white ml-4">
                    Eliminar
                </button>

            </Form>
~~~

- Esta url de eliminar no existe, así que voy al main.jsx y la añado la url en el route

~~~js
  {
      path:'clientes/:clienteId/eliminar',
    }
~~~

- Ahora creo el action en Cliente.jsx con la función que todavía no he creado llamada eliminarCliente

~~~js
export async function action ({params}){
    
    eliminarCliente(params.clienteId)

    return redirect('/')
}
~~~

- Debo colocar el action en el router

~~~js
    {
      path:'clientes/:clienteId/eliminar',
      action: eliminarClienteAction
    }
~~~

- Voy a por la función eliminarCliente en clientes.js
- Copio lo que hay en actualizarCliente, cambio el método a DELETE y quito el body que no me interesa

~~~js
export async function eliminarCliente(id){
    try {

        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        await respuesta.json()
        
    } catch (error) {
        console.log(error)
    }
}
import CerrarBoton from '../img/cerrar.svg'
import { useState, useEffect } from 'react'
import Mensaje from './Mensaje'

const Modal = ({setModal, animarModal, setAnimarModal, guardarGasto, gastoEditar, setGastoEditar}) => {


    const [nombreGasto, setNombreGasto] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [categoria, setCategoria] = useState('')
    const [mensaje, setMensaje] = useState(false)
    const [id, setId] = useState('')
    const [fecha, setFecha]= useState('')

    useEffect(()=>{
        if(Object.keys(gastoEditar).length > 0){
            setNombreGasto(gastoEditar.nombreGasto)
            setCantidad(gastoEditar.cantidad)
            setCategoria(gastoEditar.categoria)
            setId(gastoEditar.id)
            setFecha(gastoEditar.fecha)

            console.log(gastoEditar)
        }
    }, [])

    const handleSubmit = (e)=>{
        e.preventDefault();

        if([nombreGasto, cantidad, categoria].includes("")){
            setMensaje(true)

            setTimeout(()=>{
                setMensaje("")
            }, 2000)
        }

        guardarGasto({nombreGasto, cantidad, categoria, id, fecha})
    }


    const ocultarModal = ()=>{
        setAnimarModal(false)
        setGastoEditar({})
        
        setTimeout(()=>{
            setModal(false)
            
        }, 500)
    }


  return (
    <div className="modal w-full mx-auto">
        <div>
            <img src={CerrarBoton} 
                alt="botón de cerrar" 
                className="cerrarBtn"
                onClick={ocultarModal}/>
        </div>

        <form onSubmit={handleSubmit} className={`flex w-1/6 formulario flex-col mx-auto mt-10 ${animarModal ? 'animar' : 'cerrar'}`}>
         
            <div className="mb-8">
                <label className="text-white font-bold text-2xl block mb-4 text-center">Nombre Gasto </label>
                <input type="text"
                   className="p-2 rounded text-center px-14" 
                   value={nombreGasto}
                   onChange={(e)=>setNombreGasto(e.target.value)}/>
            </div>
            <div className="mb-8">
                <label className="text-white font-bold text-2xl block mb-4 text-center">Cantidad </label>
                <input type="number"
                 className="p-2 rounded text-center px-14"
                 value={cantidad} 
                 onChange={(e)=>setCantidad(Number(e.target.value))}/>
            </div>
            <div className="mb-8">
                <label className="text-white font-bold text-2xl block mb-4 text-center mx-auto">Categoría Gasto </label>
                <select name="" id="categoría" className="p-3 px-20 rounded-xl mx-auto text-center "
                value={categoria}
                onChange={(e)=>setCategoria(e.target.value)}>
                    <option value="">--Seleccione--</option>
                    <option value="comida">Comida</option>
                    <option value="casa">Casa</option>
                    <option value="gastos">Gastos Varios</option>
                    <option value="ocio">Ocio</option>
                    <option value="salud">Salud</option>
                    <option value="subscripciones">Subscripciones</option>
                </select>
            </div>

            <input type="submit" value={gastoEditar.nombreGasto ? "Editar Gasto": "Añadir Gasto"} className=" ml-8 py-3 bg-indigo-600 text-white uppercase font-bold text-2xl rounded-xl text-center"/>
        </form>
        {mensaje && <Mensaje tipo="error">{"Todos los campos son obligatorios"}</Mensaje>}
        

    </div>
  )
}

export default Modal
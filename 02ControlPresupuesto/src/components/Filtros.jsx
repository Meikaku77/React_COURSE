import {useState, useEffect} from 'react'

const Filtros = ({filtro, setFiltro}) => {
  return (
    <div className="bg-gray-50 rounded text-center">
        <form>
            <div>
                <label className="text-gray-700 font-bold text-lg block">Filro Gastos</label>
                <select name="" id="categoría" className="p-3 px-20 rounded-xl mx-auto text-center"
                    value={filtro} onChange={(e)=>(setFiltro(e.target.value))}>
                    
                    <option value="">--Seleccione--</option>
                    <option value="comida">Comida</option>
                    <option value="casa">Casa</option>
                    <option value="gastos">Gastos Varios</option>
                    <option value="ocio">Ocio</option>
                    <option value="salud">Salud</option>
                    <option value="subscripciones">Subscripciones</option>
                </select>
            </div>
        </form>

    </div>
  )
}

export default Filtros
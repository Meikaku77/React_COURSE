# Apuntes

## Formatear números a dinero

- No modifica el dato original, solo le da formato

~~~js
cantidad.toLocaleString('en-US', {
    style: 'currency',
    currency:'USD'
})
~~~

## Primeros pasos para crear un modal

~~~js
.modal {
    position: absolute;
    background-color: rgb(0 0 0 / 0.92);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
~~~

- Usando setTimeOut con el state de animarModal, más la animación de CSS e inyectaándolo con un ternario, pero no funciona con Tailwind
- debería hacer el CSS aparte. Sirve como ejemplo para añadir una u otra clase de CSS dinámicamente según el state

~~~js
        <form className={`flex w-1/6 formulario flex-col mx-auto mt-10 ${animarModal ? 'animar' : 'cerrar'}`}> 
~~~

~~~css
.modal .formulario{
        transition-property: all;
        transition-duration: 300ms;
        transition-timing-function: ease-in;
        opacity: 1; /*debería estar en 0 pero no funka*/
    
}

.modal .formulario .animar{
    position: relative;
    opacity: 1;
}

.modal .formulario .cerrar{
    opacity: 0;
}
~~~

~~~js
 const handleNuevoGasto = ()=>{
    setModal(true)

    setTimeout(() => {
      setAnimarModal(true)
    }, 500);
 }
~~~
-----
## Función para generar ID

~~~js
const generarId=()=>{
    const random = Math.random().toString(36).substring(2)

    const fecha= Date.now().toString(36)

    return random + fecha
}
~~~

----
## Formatear fecha

- Formatear Date.now()
- toLocaleDateString

~~~js
export const formatearFecha = (fecha)=>{
    const fechaNueva = new Date(fecha)

    const opciones ={
        year:'numeric',
        month:'long',
        day:'2-digit'
    }

    return fechaNueva.toLocaleDateString('es-ES', opciones)

}
~~~
----

# Para mantener la pantalla oscura del modal

~~~css
.fijar{
    overflow: hidden;
    height: 100vh;
}
~~~
- div principal de App.jsx

~~~js
<div className={modal? 'fijar': ""}>
~~~

- Le defino una altura de 100 y lo que se salga de ahi lo va a ocultar

-----
## Limpiar el state

- Es importante después de realizar ciertas acciones, limpiar el state.
- Porque si no va a dar un comprtamiento errático y no vas a saber de dónde viene, solo desde components del navegador

# REDUX LOGIN

- Install redux toolkit

> yarn add @reduxjs/toolkit react-redux

- Crear el store en src/store/store.js

~~~js
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer:{}
})
~~~

- Falta el reducer
- Primero rodeo con el Provider (lo importo de react-redux) y el store la aplicación
- Lo coloco en el main.jsx

~~~js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

import { JournalApp } from './JournalApp';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <JournalApp />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
~~~

- Ahora el reducer
- Uso el snippet rdxslice para crear el slice
- Status inicial 'checking' porque no se si está autenticado o no. Tendré otros como 'non-authenticated' y 'authenticated'
- Cuando se autentique voya tener el uid (ahora en null), email, displayName, photoURL, y un errorMessage por si lo necesito en algun lado de mi app
- Coloco el cascarón de los reducers
- Internamente tengo el state y el action, como cualquier otro reducer
- El payload puede ser necesario o no, ya veré que hago con él
- CheckingCredentials me va ayudar para bloquar botones y evitar dobles submits mientras hago una tarea asincrona
- Desestructuro las acciones

~~~js
import { createSlice, createAction } from '@reduxjs/toolkit';


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', //not-authenticated, authenticated
        uid: null,
        email: null,
        displayName: null,
        photoURL: null,
        errorMessage: null
    },
    reducers:{
        login: (state, action)=>{

        },
        logout: (state, payload)=>{

        },

        checkingCredentials: (state)=>{

        }

    }
})

export const {login, logout, checkingCredentials} = authSlice.actions

export default authSlice.reducer
~~~

- Coloco el reducer en el store

~~~js
import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth/authSlice'

export const store = configureStore({
    reducer:{
        auth: authSlice
    }
})
~~~

## Manejo del formulario de login

- Como el LOGIN es asíncrono, voy a tener que disparar algún THUNK
- Cambio el estado de status a no autenticado en duro en el slice para codear
- Uso el custom hook useForm

~~~js
import React, { useState } from 'react'

const useForm = (initialForm={}) => {
  
    const [formState, setFormState]= useState( initialForm)
  
  const onInputChange=({target})=>{
        const {name, value} = target

        setFormState({
            ...formState,
            [name]: value 
        })
  }

  const onResetForm=()=>{
    setFormState(initialForm)
  }
  
  
    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm
    }
  
}

export default useForm
~~~

- Voy al LoginPage
- Como este formulario no va a salir de esta pantalla lo voy a manejar localmente
- desestructuro del useForm
- Coloco el name, el value y el onChange en el formulario
- Creo el handleSubmit del onSubmit del formulario con un console.log para comprobar que llegan los datos
- En el botón de login le agrego el type="submit"

~~~js
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import { AuthLayout } from '../layout/AuthLayout';
import useForm from '../../hooks/useForm';


export const LoginPage = () => {


  const {email, password, onInputChange}= useForm({
    email: 'miguecast@gmail.com',
    password: '123456'
  })

  const handleSubmit = (e)=>{
    e.preventDefault()

    console.log({email,password})
  }


  return (
    <AuthLayout title="Login">
      <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                label="Correo" 
                type="email" 
                placeholder='correo@google.com' 
                fullWidth
                name="email"
                value={email}
                onChange={onInputChange}
              />
            </Grid>

            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                label="Contraseña" 
                type="password" 
                placeholder='Contraseña' 
                fullWidth
                name="password"
                value={password}
                onChange={onInputChange}
              />
            </Grid>
            
            <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={ 12 } sm={ 6 }>
                <Button type="submit" variant='contained' fullWidth>
                  Login
                </Button>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <Button variant='contained' fullWidth>
                  <Google />
                  <Typography sx={{ ml: 1 }}>Google</Typography>
                </Button>
              </Grid>
            </Grid>


            <Grid container direction='row' justifyContent='end'>
              <Link component={ RouterLink } color='inherit' to="/auth/register">
                Crear una cuenta
              </Link>
            </Grid>

          </Grid>


        </form>

    </AuthLayout>
  )
}
~~~




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
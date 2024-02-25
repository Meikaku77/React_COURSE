import React from 'react'

const Error = ({children}) => {
  return (
    <div className="bg-red-800 text-white font-bold text-center text-xl rounded-xl mb-5 p-2"> 
        {children}
    </div>
  )
}

export default Error
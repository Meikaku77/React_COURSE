import React from 'react'

const Error = ({children}) => {
  return (
    <div className="text-center bg-red-600 text-white text-xl font-bold md:w-1/4 ml-4 rounded mt-3">
        {children}</div>
  )
}

export default Error
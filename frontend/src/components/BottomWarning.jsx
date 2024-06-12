import React from 'react'
import {Link} from "react-router-dom"

export default function BottomWarning({label, buttonText, to}) {
  return (
    <div>
      <div className='py-2 text-sm flex justify-center'>{label}</div>
      <Link  
        className='pointer underline pl-1 cursor-pointer'
        to={to}
      >{buttonText}</Link>
    </div>
  )
}

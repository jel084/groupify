import React from 'react'
const FormButton = ({ ...props }) => {
  return (
    <div className='rounded-lg py-1 bg-[#C8E2E1] cursor-pointer hover:bg-[#a3d2d0] drop-shadow-md'>
      <button type='submit' >{props.btnText}</button>
    </div>
  )
}

export default FormButton
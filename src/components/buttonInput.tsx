import React from 'react'

type Input = {
    label: string;
    handleButton: ()=> void;
}

const ButtonInput = (props: Input) => {
  return (
    <button className='flex justify-center items-center bg-[#418713] py-3 px-7 rounded-md text-white mt-5 shadow-sm'>{props.label}</button>
  )
}

export default ButtonInput
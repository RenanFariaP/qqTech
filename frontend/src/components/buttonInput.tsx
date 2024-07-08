import React from 'react'

type Input = {
    label: string;
    onSubmit?: ()=>void;
    onClick?: ()=>void;
}

const ButtonInput = (props: Input) => {
  return (
    <button onSubmit={props.onSubmit} type='submit' className='flex justify-center items-center bg-[#418713] py-2 px-7 rounded-md text-white my-5 shadow-sm'>{props.label}</button>
  )
}

export default ButtonInput
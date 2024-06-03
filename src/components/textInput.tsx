import React from 'react'

type Input = {
    label: string;
    type: string;
}

const TextInput = (props: Input) => {
  return (
    <div className='flex flex-col'>
        <label className='mt-5'>{props.label}</label>
        <input type={props.type} name="user" className='bg-zinc-300 rounded-md w-80 h-10 outline-none p-5'/>
    </div>
  )
}

export default TextInput
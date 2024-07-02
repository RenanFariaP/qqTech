import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

type Props= {
    children: React.ReactNode,
    text: string,
    route: string,
}

const NavBarItem = ({children, text, route}: Props) => {
  const pathName = usePathname();
  useEffect(()=>{},[pathName])
  if(pathName === route){
    return (
      <Link href={route} className='flex gap-2 p-5 border rounded-md cursor-pointer bg-[#418713] text-white font-bold'>
          <div className=''>{children}</div>
          <div className=''>{text}</div>
      </Link>
    )
  }
  return (
    <Link href={route} className='flex gap-2 p-5 border rounded-md cursor-pointer hover:bg-[#fdf361] '>
        <div className='font-bold'>{children}</div>
        <div className='font-bold'>{text}</div>
    </Link>
  )
}

export default NavBarItem
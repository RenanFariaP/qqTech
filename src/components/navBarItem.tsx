import Link from 'next/link'
import React from 'react'

type Props= {
    children: React.ReactNode,
    text: string,
    route: string,
}

const NavBarItem = (props: Props) => {
  return (
    <Link href={props.route} className='flex gap-2 p-5 border rounded-md cursor-pointer'>
        <div className=''>{props.children}</div>
        <div className=''>{props.text}</div>
    </Link>
  )
}

export default NavBarItem
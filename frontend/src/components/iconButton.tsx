import React from 'react'
import deleteIcon from '../../public/assets/svg/deleteIcon.svg'
import addIcon from '../../public/assets/svg/addIcon.svg'
import moreIcon from '../../public/assets/svg/seeMoreIcon.svg'
import Image from 'next/image'

export enum Icon{
    add = 'add',
    delete = 'delete',
    more = 'more'
}

const iconMap: Record<Icon, string> = {
    add: addIcon,
    delete: deleteIcon,
    more: moreIcon
}

interface Props {
    onClick: () =>void;
    icon: Icon
}

const IconButton = ({onClick, icon}: Props) => {
  return (
    <button onClick={onClick} className='lg:bg-none w-full flex justify-center'>
        <Image src={iconMap[icon]} width={24} height={24} alt={`Icone de ${icon}`} />
    </button>
  )
}

export default IconButton
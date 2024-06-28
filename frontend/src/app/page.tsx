"use client"

import { checkUserAuthenticated } from '@/functions/check-user-authenticated';
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Home = ({children}:{children: React.ReactNode}) => {
  const router = useRouter();
  const isUserAuthenticated =  checkUserAuthenticated();

  useEffect(()=>{
    if(isUserAuthenticated){
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router])
  return (
    <div>{children}</div>
  )
}

export default Home;
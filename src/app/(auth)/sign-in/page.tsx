import { auth } from '@/lib/auth'
import { SigninView } from '@/modules/auth/ui/views/sign-in-view copy'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  }) 
  if(!!session) {
    redirect("/")
  }
  return (
    <div>
      <SigninView />
    </div>
  )
}

export default page
"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { authClient } from '@/lib/auth-client'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const HomeTask = () => {
    const [checked, setChecked] = useState(false)


    const router = useRouter()
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const {data} = useSuspenseQuery(trpc.task.read.queryOptions({}))
    console.log(data)
    const onButtonClick = async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess : () => {
            router.push("/sign-up")
          }
        }
      })
    }

    const mutation = useMutation(trpc.task.delete.mutationOptions({
      onSuccess : () => {
      queryClient.invalidateQueries(
        trpc.task.read.queryOptions({})
      )
      },
      onError : (error) => {
        console.log(error)
      }
    }))

    const onDelete = (id:string) => {
      mutation.mutate({id})
    }


  return (
    <div className='flex flex-col gap-y-6'>
        {data?.map((task)=>
        (
          <div key={task.id} className='flex justify-center items-center gap-x-4'>
            <Checkbox className='border border-black' />{task.task} <Button onClick={()=> onDelete(task.id)}>
              {mutation.isPending?'Deleting':'Delete'}
            </Button>
          </div>
        )
        )}
        <div>
          <Button onClick={onButtonClick}>
            Logout
          </Button>
        </div>
    </div>
  )
}

export default HomeTask
"use client"

import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'

const HomeView = () => {
  const [task, setTask] = useState("")
  const trpc=useTRPC()
  const queryClient= useQueryClient()
  const mutation = useMutation(trpc.task.create.mutationOptions({
    onSuccess : async () => {
      setTask('')
      await queryClient.invalidateQueries(
        trpc.task.read.queryOptions({})
      )
    },
    onError : (error) => {
      console.log(error)
    }
  }))


  const onButtonClick = () => {
    if(task.trim()){
      mutation.mutate({task})
    }
  }
  return (
    <div className='flex gap-x-4'>
        <input type="text" 
        className='border border-black rounded-md text-center text-black'
        value={task}
        onChange={(e)=> setTask(e.target.value)}
        />
        <Button onClick={onButtonClick}>
            {mutation.isPending ? 'Adding': 'Add task'}
        </Button>
    </div>
  )
}

export default HomeView
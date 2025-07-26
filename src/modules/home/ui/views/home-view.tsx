"use client"

import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'

const HomeView = () => {
  const [task, setTask] = useState("")
  const trpc=useTRPC()
  const queryClient= useQueryClient()
  const addTask = useMutation(trpc.task.create.mutationOptions({
    onSuccess : async () => {
      setTask('')
      await queryClient.invalidateQueries(
        trpc.task.read.queryOptions({})
      )
    },
    onError : () => {
      toast.error("Error occured while adding task")
    }
  }))


  const onButtonClick = () => {
    if(task.trim()){
      addTask.mutate({task})
    }
  }

  const handleKeyDown = (e:React.KeyboardEvent) => {
    if(e.key==="Enter" && !e.shiftKey){
      onButtonClick()
    }
  }

  return (
    <div className='flex gap-x-4'>
        <input type="text" 
        className='border border-black rounded-md text-center text-black'
        value={task}
        disabled={addTask.isPending}
        onKeyDown={handleKeyDown}
        onChange={(e)=> setTask(e.target.value)}
        />
        <Button onClick={onButtonClick}>
            {addTask.isPending ? 'Adding': 'Add task'}
        </Button>
    </div>
  )
}

export default HomeView
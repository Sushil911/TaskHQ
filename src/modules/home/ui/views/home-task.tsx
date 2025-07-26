'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { authClient } from '@/lib/auth-client'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const HomeTask = () => {
  const router =useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [page,setPage] = useState(1)
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const updateTask = useMutation(trpc.task.update.mutationOptions({
    onSuccess : () => {
      queryClient.invalidateQueries(
        trpc.task.read.queryOptions({page})
      )
    },
    onError : () => {
      toast.error("Error occured while updating task")
    },
  }))

  const {data:tasks} = useSuspenseQuery(trpc.task.read.queryOptions({page}))

  const deleteTask = useMutation(trpc.task.delete.mutationOptions({
    onMutate : (input) => {
      setDeletingId(input.id)
    },
    onSettled : () => {
      setDeletingId(null)
    },
    onSuccess : () => {
      queryClient.invalidateQueries(
        trpc.task.read.queryOptions({page})
      )
    },
    onError : () => {
      toast.error("Error occured while deleting data")
    },
  }))

  const onLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions : {
          onSuccess : () => {
            router.push("/sign-in")
            toast.success("Logged out successfully")
          }
        }
      })
    }
    catch(error){
      toast.error("Failed to logout")
    }
  }

  const handleNextPage = () => {
    if(tasks?.hasNextPage) {
      setPage(prev => prev+1)
    }
  }

  const handlePreviousPage = () => {
    if (tasks?.hasPreviousPage) {
      setPage(prev => prev-1)
    }
  }

  return (
    <div className='space-y-4'>
      {tasks?.taskReturned.map((task)=> (
        <div key={task.id} className='flex items-center gap-x-4 p-3 border rounded-2xl'>
          <Checkbox
          disabled={updateTask.isPending}
          checked={task.completed || false}
          onCheckedChange={(checked)=> 
            updateTask.mutate({
              id:task.id,
              completed: Boolean(checked)
            })
          }
          />
          <span className={`flex-1 ${task.completed ? 'line-through text-gray-500':''}`}>
            {task.task}
          </span>
          <Button
          variant="ghost"
          disabled={deletingId === task.id}
          onClick={()=>{
            deleteTask.mutate({
              id:task.id
            })
          }}
          >
            {deletingId === task.id ? 'Deleting':'Delete'}
          </Button>
        </div>
      ))}
      <div className='flex items-center justify-between'>
        <Button variant="outline" disabled={!tasks?.hasPreviousPage} onClick={handlePreviousPage}>
          Previous
        </Button>
        <div className='text-sm text-gray-600'>
          Page {page} of {tasks?.totalPages || 1}
        </div>
        <Button variant="outline" disabled={!tasks?.hasNextPage} onClick={handleNextPage}>
          Next
        </Button>
      </div>
      <Button
      onClick={onLogout}
      >
        Logout
      </Button>
    </div>
  )
}

export default HomeTask
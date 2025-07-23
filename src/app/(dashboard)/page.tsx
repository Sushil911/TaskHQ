import { ErrorState } from '@/components/error'
import { LoadingState } from '@/components/loading'
import { auth } from '@/lib/auth'
import HomeTask from '@/modules/home/ui/views/home-task'
import HomeView from '@/modules/home/ui/views/home-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'
import {ErrorBoundary} from "react-error-boundary"

const page = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        redirect("/sign-up")
    }

    const queryClient= getQueryClient()
    void queryClient.prefetchQuery(trpc.task.read.queryOptions({}))

  return (
    <div className='flex flex-col h-screen w-screen justify-center items-center gap-y-8'>
        <HomeView />
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState />}>
                <ErrorBoundary fallback={<ErrorState />}>
                    <div>
                        <HomeTask />
                    </div>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    </div>
  )
}

export default page
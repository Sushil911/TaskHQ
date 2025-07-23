"use client"

import { useForm } from "react-hook-form"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {FaGithub, FaGoogle} from "react-icons/fa"
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";




const formSchema = z.object({
    email:z.email(),
    password:z.string().min(1,{message:"Password is required"}),
})

export const SigninView = () => {
    const [error, setError] = useState<null | string>(null)
    const [pending, setPending] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            email:'',
            password:'',
        }
    })

    const onSubmit = (values:z.infer<typeof formSchema>) => {
        setPending(true)
        setError(null)
        authClient.signIn.email({
            email:values.email,
            password:values.password,
            callbackURL:"/"
        },{
            onSuccess: () => {
                setPending(false)
                setError(null)
            },
            onError: ({error}) => {
                setPending(false)
                setError(error.message)
            }
        }
    )
    }

    const onGithubSignin = () => {
        setPending(true)
        setError(null)
        authClient.signIn.social({
            provider:"github",
            callbackURL:"/"
        },{
            onSuccess : () => {
                setPending(false)
                setError(null)
            },
            onError : ({error}) => {
                setPending(false)
                setError(error.message)
            }        })
    }

    return (
        <div className=" h-screen w-screen flex flex-1 justify-center items-center bg-slate-200">
        <Card className="h-[480px] w-[400px] px-4 py-4 flex-col justify-center">
            <CardHeader>
                    <h1 className="font-bold text-2xl text-center text-balance">
                        Welcome to TaskHQ
                    </h1>
            </CardHeader>
            <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        
                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            {!!error && (
                                <Alert>
                                    <OctagonAlertIcon />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}
                            <div className="flex justify-center">
                                <Button disabled={pending} type="submit">Signin</Button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                            <div className="flex justify-center">
                                <Button variant="outline" className="w-full" disabled={pending} onClick={onGithubSignin}>
                                    <FaGoogle />
                                </Button>
                            </div>
                            <div className="flex justify-center">
                                <Button variant="outline" className="w-full" disabled={pending} onClick={onGithubSignin}>
                                    <FaGithub />
                                </Button>
                            </div>
                            </div>
                            <div className="text-center text-sm">
                                Don't have an account? <Link className="hover:opacity-[50%] underline" href="/sign-up">SignUp</Link>
                            </div>
                            </form>
                        </Form>
            </CardContent>
        </Card>
        </div>
    )
}
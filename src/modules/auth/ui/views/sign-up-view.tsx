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
import { useRouter } from "next/navigation";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const formSchema = z.object({
    name:z.string().min(1,{error:"Name is required"}),
    email:z.email(),
    password:z.string().min(1,{message:"Password is required"}),
    confirmPassword:z.string().min(1,{error:"Password is required"}),
}).refine(data=>
    data.password===data.confirmPassword,{
        message:"Passwords must match",
        path:["confirmPassword"]
    }
)

export const SignupView = () => {
    const router= useRouter()
    const [error, setError] = useState<null | string>(null)
    const [pending, setPending] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            name:'',
            email:'',
            password:'',
            confirmPassword:''
        }
    })

    const onSubmit = (values:z.infer<typeof formSchema>) => {
        setPending(true)
        setError(null)
        authClient.signUp.email({
            name:values.name,
            email:values.email,
            password:values.password,
            callbackURL:"/"
        },{
            onSuccess: () => {
                setPending(false)
                router.push("/")
                
            },
            onError: ({error}) => {
                setPending(false)
                setError(error.message)
            }
        }
    )
    }

    const onSocialSignin = (provider:"github"|"google") => {
        setPending(true)
        setError(null)
        authClient.signIn.social({
            provider:provider,
            callbackURL:"/"
        },{
            onSuccess : () => {
                setPending(false)
                setError(null)
            },
            onError : ({error}) => {
                setError(error.message)
            }        })
    }

    return (
        <div className=" h-screen w-screen flex flex-1 justify-center items-center bg-slate-200">
        <Card className="h-[680px] w-[400px] px-4 py-4 flex-col justify-center">
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
                            name="name"
                            render={({ field }) => 
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }
                            />

                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => 
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }
                            />
                        
                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => 
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            }
                            />
                            <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => 
                                <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="********" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            }
                            />
                            {!!error && (
                                <Alert>
                                    <OctagonAlertIcon />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}
                            <div className="flex justify-center">
                                <Button disabled={pending} 
                                className="w-full" 
                                type="submit">
                                    Signup
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2">
                            <div className="flex justify-center">
                                <Button variant="outline" className="w-full" disabled={pending} onClick={() => onSocialSignin("google")}>
                                    <FaGoogle />
                                </Button>
                            </div>
                            <div className="flex justify-center">
                                <Button variant="outline" className="w-full" disabled={pending} onClick={() => onSocialSignin("github")}>
                                    <FaGithub />
                                </Button>
                            </div>
                            </div>
                            <div className="text-center text-sm">
                                Already have an account? <Link className="hover:opacity-[50%] underline" href="/sign-in">SignIn</Link>
                            </div>
                            </form>
                        </Form>
            </CardContent>
        </Card>
        </div>
    )
}
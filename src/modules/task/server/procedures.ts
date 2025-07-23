import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { db } from "@/db";
import { task } from "@/db/schema";
import { and, eq, getTableColumns } from "drizzle-orm";

export const TaskRouters = createTRPCRouter({
    read : protectedProcedure
    .input(z.object({}))
    .query(async ({ctx})=> {
        const taskReturned = await db.select({...getTableColumns(task)})
        .from(task)
        .where(eq(task.userId,ctx.auth.user.id))
        return taskReturned
    }),
    create: protectedProcedure
    .input(
        z.object({task:z.string().min(1,{error:"Task is required"})})
    )
    .mutation(async ({input,ctx}) => {
        const [createdTask] = await db
        .insert(task)
        .values({
            ...input,
            userId:ctx.auth.user.id
        })
        .returning()
        return createdTask
    }),
    delete: protectedProcedure
    .input(z.object({id:z.string()}))
    .mutation(async ({input,ctx}) => {
        db.
        delete(task)
        .where(
            and(
                eq(task.id,input.id),
                eq(task.userId,ctx.auth.user.id)
            )
        )
    })
})
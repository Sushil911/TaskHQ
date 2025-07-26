import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { db } from "@/db";
import { task } from "@/db/schema";
import { and, asc, count, desc, eq, getTableColumns } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "../../../../constants";

export const TaskRouters = createTRPCRouter({
    read : protectedProcedure
    .input(z.object({
        page:z.number().default(DEFAULT_PAGE),
        pageSize:z.number()
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE)
    }))
    .query(async ({ctx,input})=> {
        const {page,pageSize}=input
        const taskReturned = await db.select({...getTableColumns(task)})
        .from(task)
        .where(eq(task.userId,ctx.auth.user.id))
        .orderBy(desc(task.createdAt))
        .limit(pageSize)
        .offset((page-1)*pageSize)

        const [total] = await db
        .select({count:count()})
        .from(task)
        .where(eq(task.userId,ctx.auth.user.id))

        const totalPages = Math.ceil(total.count/pageSize)

        return {
            totalPages,
            total: total.count,
            taskReturned,
            hasNextPage:page<totalPages,
            hasPreviousPage:page>1
        }

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
        const [deletedTask] = await db.
        delete(task)
        .where(
            and(
                eq(task.id,input.id),
                eq(task.userId,ctx.auth.user.id)
            )
        )
        .returning()
        return deletedTask
    }),
    update : protectedProcedure
    .input(
        z.object({
            id:z.string(),
            task:z.string().optional(),
            completed: z.boolean().optional()
    }))
    .mutation(async ({input,ctx}) => {
        const updatedTask= await db
        .update(task)
        .set({
            task:input.task,
            completed: input.completed
        })
        .where(
            and(
                eq(task.id,input.id),
                eq(task.userId,ctx.auth.user.id)
            )
        )
        .returning()
        return updatedTask[0]
    })
})
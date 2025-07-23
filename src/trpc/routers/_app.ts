import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { TaskRouters } from '@/modules/task/server/procedures';
export const appRouter = createTRPCRouter({
  task:TaskRouters
});
// export type definition of API
export type AppRouter = typeof appRouter;
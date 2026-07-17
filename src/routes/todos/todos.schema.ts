import { z } from 'zod'

export const createTodoBody = z.object({
  title: z.string().min(1).max(100).describe('Todo title'),
  description: z.string().max(500).optional().describe('Todo description'),
  completed: z.boolean().optional().default(false).describe('Completion status')
})

export const updateTodoBody = z.object({
  title: z.string().min(1).max(100).optional().describe('Todo title'),
  description: z.string().max(500).optional().describe('Todo description'),
  completed: z.boolean().optional().describe('Completion status')
})

export const todoParams = z.object({
  id: z.string().uuid().describe('Todo ID')
})

export const todoResponse = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const todosListResponse = z.object({
  todos: z.array(todoResponse),
  total: z.number()
})

export type CreateTodoBody = z.infer<typeof createTodoBody>
export type UpdateTodoBody = z.infer<typeof updateTodoBody>
export type TodoParams = z.infer<typeof todoParams>
export type TodoResponse = z.infer<typeof todoResponse>

export const todosSchemas = {
  createTodoBody,
  updateTodoBody,
  todoParams,
  todoResponse,
  todosListResponse
}

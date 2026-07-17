import { eq } from 'drizzle-orm'
import { FastifyReply, FastifyRequest } from 'fastify'

import { getDb } from '@/db/dbManager'
import { todos } from '@/db/schemas/todos'
import { CreateTodoBody, TodoParams, UpdateTodoBody } from './todos.schema'

export const getTodos = async (_request: FastifyRequest, reply: FastifyReply) => {
  const db = getDb()
  const result = await db.select().from(todos).orderBy(todos.createdAt)
  reply.code(200).send({ todos: result, total: result.length })
}

export const getTodo = async (request: FastifyRequest<{ Params: TodoParams }>, reply: FastifyReply) => {
  const db = getDb()
  const result = await db.select().from(todos).where(eq(todos.id, request.params.id))
  const todo = result[0]
  if (!todo) {
    return reply.code(404).send({ message: 'Todo not found' })
  }
  reply.code(200).send(todo)
}

export const createTodo = async (request: FastifyRequest<{ Body: CreateTodoBody }>, reply: FastifyReply) => {
  const db = getDb()
  const result = await db
    .insert(todos)
    .values({
      title: request.body.title,
      description: request.body.description ?? null,
      completed: request.body.completed ?? false
    })
    .returning()
  reply.code(201).send(result[0])
}

export const updateTodo = async (request: FastifyRequest<{ Params: TodoParams; Body: UpdateTodoBody }>, reply: FastifyReply) => {
  const db = getDb()
  const result = await db
    .update(todos)
    .set({
      ...request.body,
      updatedAt: new Date()
    })
    .where(eq(todos.id, request.params.id))
    .returning()
  const todo = result[0]
  if (!todo) {
    return reply.code(404).send({ message: 'Todo not found' })
  }
  reply.code(200).send(todo)
}

export const deleteTodo = async (request: FastifyRequest<{ Params: TodoParams }>, reply: FastifyReply) => {
  const db = getDb()
  const result = await db.delete(todos).where(eq(todos.id, request.params.id)).returning({ id: todos.id })
  if (result.length === 0) {
    return reply.code(404).send({ message: 'Todo not found' })
  }
  reply.code(204).send()
}

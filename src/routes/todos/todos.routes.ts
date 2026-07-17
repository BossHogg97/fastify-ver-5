import { FastifyZodOpenApiSchema } from 'fastify-zod-openapi'
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from './todos.controller'
import { todosSchemas } from './todos.schema'

export default async function todoRoutes(fastify: any) {
  fastify.get('/', {
    schema: {
      summary: 'List all todos',
      description: 'Returns a list of all todos',
      tags: ['Todos'],
      response: {
        200: todosSchemas.todosListResponse
      }
    } satisfies FastifyZodOpenApiSchema,
    handler: getTodos
  })

  fastify.get('/:id', {
    schema: {
      summary: 'Get a todo by ID',
      description: 'Returns a single todo by its UUID',
      tags: ['Todos'],
      params: todosSchemas.todoParams,
      response: {
        200: todosSchemas.todoResponse
      }
    } satisfies FastifyZodOpenApiSchema,
    handler: getTodo
  })

  fastify.post('/', {
    schema: {
      summary: 'Create a new todo',
      description: 'Creates a new todo item',
      tags: ['Todos'],
      body: todosSchemas.createTodoBody,
      response: {
        201: todosSchemas.todoResponse
      }
    } satisfies FastifyZodOpenApiSchema,
    handler: createTodo
  })

  fastify.put('/:id', {
    schema: {
      summary: 'Update a todo',
      description: 'Updates an existing todo by its UUID',
      tags: ['Todos'],
      params: todosSchemas.todoParams,
      body: todosSchemas.updateTodoBody,
      response: {
        200: todosSchemas.todoResponse
      }
    } satisfies FastifyZodOpenApiSchema,
    handler: updateTodo
  })

  fastify.delete('/:id', {
    schema: {
      summary: 'Delete a todo',
      description: 'Deletes a todo by its UUID',
      tags: ['Todos'],
      params: todosSchemas.todoParams,
      response: {
        204: { description: 'Todo deleted successfully' }
      }
    } satisfies FastifyZodOpenApiSchema,
    handler: deleteTodo
  })
}

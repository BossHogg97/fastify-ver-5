import FastifyStatic from '@fastify/static'
import fastifyPlugin from 'fastify-plugin'
import path from 'path'

export default fastifyPlugin(async function (
  fastify: any,
  options: {
    prefix?: string
  }
) {
  const publicPath = path.join(process.cwd(), 'packages/sharedbe/static')

  const prefix = options.prefix || '/public'

  await fastify.register(FastifyStatic, {
    root: publicPath,
    prefix
  })

  fastify.log.info(`Serving static files from ${publicPath} as ${prefix}`)
})

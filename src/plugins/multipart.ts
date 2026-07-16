import multipart from '@fastify/multipart'
import fastifyPlugin from 'fastify-plugin'

// Define an interface for the limits
export interface MultipartLimits {
  fileSize: number // Max file size in bytes
  files: number // Max number of file fields
  fieldNameSize?: number // Max field name size in bytes
  fieldSize?: number // Max field value size in bytes
  fields?: number // Max number of non-file fields
  headerPairs?: number // Max number of header key=>value pairs
  parts?: number // Max number of parts (fields + files)
}

export default fastifyPlugin(async function (fastify: any, opts: { limits: MultipartLimits; attachFieldsToBody?: boolean }) {
  const { limits, attachFieldsToBody } = opts

  await fastify.register(multipart, {
    attachFieldsToBody: attachFieldsToBody || true,
    limits
  })

  fastify.log.debug(`Registered plugin multipart with options : ${JSON.stringify(limits)}`)
})

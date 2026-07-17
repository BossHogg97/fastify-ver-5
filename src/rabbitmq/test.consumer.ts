import fastifyPlugin from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'

// Enumerators
import { RabbitExchanges, RabbitQueues } from '@/enums/rabbit'

interface FolderCopyMessage {
  sourceFolder: string
  destinationFolder: string
  sourcePlantVersionId: string
}

export default fastifyPlugin(
  async (app: FastifyInstance) => {
    // 1. Declare queue if not exist
    await app.rabbitmq.queueDeclare({ queue: RabbitQueues.QUEUE_NAME, durable: true })

    // 2. Declare an exchange with type fanout if not exist
    await app.rabbitmq.exchangeDeclare({ exchange: RabbitExchanges.EXCHANGE_NAME, type: 'fanout', durable: true })

    // 3. Bind queue with the exchange
    await app.rabbitmq.queueBind({ queue: RabbitQueues.QUEUE_NAME, exchange: RabbitExchanges.EXCHANGE_NAME_2 })

    // 4. Create the consumer on queue that will be triggered when exchange add a message to the queue
    const consumer = app.rabbitmq.createConsumer(
      {
        queue: RabbitQueues.QUEUE_NAME,
        queueOptions: { durable: true }
      },
      async (msg) => {
        try {
          const { sourceFolder, destinationFolder, sourcePlantVersionId }: FolderCopyMessage = msg.body

          app.log.info(`=============== Message data ===============`)
          app.log.info(`Source plant version ID is ${sourcePlantVersionId}`)
          app.log.info(`Source plant family is ${sourceFolder}`)
          app.log.info(`Destionation plant family is ${destinationFolder}`)
          app.log.info(`============================================`)

          if (!sourceFolder || !destinationFolder) {
            throw new Error('Invalid message: sourceFolder and destinationFolder are required')
          }

          // !! Logic of the consumer
          const dataToSend = {}

          // Send data to specified exchange
          await app.collectPlantDataPublisher.send({ exchange: RabbitExchanges.EXCHANGE_NAME_2 }, dataToSend)
        } catch (error) {
          app.log.error('Failed to process folder copy message' + error)
          throw error
        }
      }
    )

    app.addHook('onClose', async () => {
      await consumer.close()
    })
  },
  { name: 'test-consumer' }
)

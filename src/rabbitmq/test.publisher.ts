import fastifyPlugin from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'

// Enumerators
import { RabbitExchanges } from '@/enums/rabbit'

// Infer the publisher type from Fastify's rabbitmq plugin
type Publisher = ReturnType<FastifyInstance['rabbitmq']['createPublisher']>

// Extend the Fastify instance to include the collect-plant-data publisher
declare module 'fastify' {
  interface FastifyInstance {
    collectPlantDataPublisher: Publisher
  }
}

// Plugin that creates and decorates a RabbitMQ publisher for plant data collection events
export default fastifyPlugin(
  async (app: FastifyInstance) => {
    // Create a confirmed publisher with retry logic, bound to the EXCHANGE_NAME_2 fanout exchange
    const publisher = app.rabbitmq.createPublisher({
      confirm: true,
      maxAttempts: 2,
      exchanges: [{ exchange: RabbitExchanges.EXCHANGE_NAME_2, type: 'fanout', durable: true }]
    })

    // Decorate the Fastify instance so the publisher is accessible as app.collectPlantDataPublisher
    app.decorate('collectPlantDataPublisher', publisher)

    // Gracefully close the publisher when the Fastify instance shuts down
    app.addHook('onClose', async () => {
      await publisher.close()
    })
  },
  { name: 'test-publisher' }
)
